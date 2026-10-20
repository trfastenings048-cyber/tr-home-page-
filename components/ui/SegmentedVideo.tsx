"use client";

import { useEffect, useRef } from "react";

type SegmentedVideoProps = {
  /** HLS playlist made by scripts/split-video.sh, e.g. "/videos/tr-corporate-overview-v1/index.m3u8". */
  playlist: string;
  /** MSE codec string of the parts, e.g. 'avc1.640028,mp4a.40.2'. */
  codecs: string;
  poster: string;
  title: string;
  className?: string;
};

type Part = { url: string; start: number; end: number };

/** Parts buffered ahead of the playhead. Keeps bandwidth to what is actually watched. */
const PARTS_AHEAD = 2;
/** Seconds kept behind the playhead before old data is dropped from the player's memory. */
const KEEP_BEHIND = 30;
/** Slack for the tiny gaps encoders leave at part boundaries. */
const EPSILON = 0.5;

/**
 * Plays a video that was split into numbered parts (init.mp4 + part-NN.m4s), back to back,
 * as one continuous video with a normal seek bar.
 *
 * - Nothing is downloaded until the viewer presses play, then parts load one at a time, in order,
 *   only a couple of parts ahead of the playhead.
 * - Every part is kept in the browser's Cache Storage, so replays and repeat visits are served
 *   from the visitor's disk instead of the server.
 * - Browsers without Media Source Extensions (older iPhones) fall back to the native HLS playlist.
 */
export function SegmentedVideo({ playlist, codecs, poster, title, className = "" }: SegmentedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const MS: typeof MediaSource | undefined =
      (window as unknown as { ManagedMediaSource?: typeof MediaSource }).ManagedMediaSource ??
      window.MediaSource;
    const mime = `video/mp4; codecs="${codecs}"`;

    if (!MS?.isTypeSupported(mime)) {
      // Native HLS (Safari on iOS < 17.1) plays the same parts in sequence by itself.
      video.preload = "none";
      video.src = playlist;
      return;
    }

    let disposed = false;
    let started = false;
    let pumping = false;
    let parts: Part[] = [];
    let sourceBuffer: SourceBuffer | null = null;
    const baseUrl = new URL(playlist, window.location.href);
    const cacheName = cacheNameFor(baseUrl.pathname);

    const mediaSource = new MS();
    // Safari's ManagedMediaSource only runs with AirPlay disabled.
    video.disableRemotePlayback = true;
    const objectUrl = URL.createObjectURL(mediaSource);
    video.src = objectUrl;

    const partAt = (time: number) => {
      const i = parts.findIndex((p) => time < p.end);
      return i === -1 ? parts.length - 1 : i;
    };

    const isBuffered = (part: Part) => {
      const ranges = sourceBuffer?.buffered;
      if (!ranges) return false;
      for (let i = 0; i < ranges.length; i++) {
        if (ranges.start(i) <= part.start + EPSILON && ranges.end(i) >= part.end - EPSILON) return true;
      }
      return false;
    };

    /** The first part from the playhead onwards that still needs loading, or -1. */
    const nextPart = () => {
      const from = partAt(video.currentTime);
      const to = Math.min(from + PARTS_AHEAD, parts.length - 1);
      for (let i = from; i <= to; i++) if (!isBuffered(parts[i])) return i;
      return -1;
    };

    const append = async (data: ArrayBuffer) => {
      const sb = sourceBuffer!;
      const behind = video.currentTime - KEEP_BEHIND;
      if (behind > 0 && sb.buffered.length && sb.buffered.start(0) < behind) {
        await whenIdle(sb, () => sb.remove(0, behind));
      }
      try {
        await whenIdle(sb, () => sb.appendBuffer(data));
      } catch (error) {
        if ((error as DOMException)?.name !== "QuotaExceededError") throw error;
        // Out of memory: drop everything behind the playhead and try once more.
        await whenIdle(sb, () => sb.remove(0, Math.max(0, video.currentTime - 1)));
        await whenIdle(sb, () => sb.appendBuffer(data));
      }
    };

    /** Loads the parts the viewer needs next, strictly one after another. */
    const pump = async () => {
      if (!started || pumping || disposed || !sourceBuffer) return;
      pumping = true;
      try {
        for (let i = nextPart(); i !== -1 && !disposed; i = nextPart()) {
          const data = await cachedFetch(cacheName, parts[i].url);
          if (disposed) return;
          await append(data);
        }
        // Once the final part is in, tell the player the stream ends so it fires "ended".
        // (Seeking back later re-opens the stream automatically on the next append.)
        if (!disposed && isBuffered(parts[parts.length - 1]) && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
      } catch (error) {
        console.error("SegmentedVideo: failed to load video part", error);
      } finally {
        pumping = false;
      }
    };

    const start = () => {
      started = true;
      void pump();
    };

    const onSourceOpen = async () => {
      try {
        const text = await (await fetch(baseUrl)).text();
        const parsed = parsePlaylist(text, baseUrl);
        if (disposed) return;
        parts = parsed.parts;
        void pruneCache(cacheName, baseUrl);

        sourceBuffer = mediaSource.addSourceBuffer(mime);
        mediaSource.duration = parts[parts.length - 1].end;
        // The init segment is a few KB and gives the player its duration and track info.
        await whenIdle(sourceBuffer, async () =>
          sourceBuffer!.appendBuffer(await cachedFetch(cacheName, parsed.init)),
        );
        if (started) void pump();
      } catch (error) {
        console.error("SegmentedVideo: failed to open video", error);
      }
    };

    mediaSource.addEventListener("sourceopen", onSourceOpen, { once: true });
    video.addEventListener("play", start);
    video.addEventListener("seeking", pump);
    video.addEventListener("timeupdate", pump);
    video.addEventListener("waiting", pump);

    return () => {
      disposed = true;
      mediaSource.removeEventListener("sourceopen", onSourceOpen);
      video.removeEventListener("play", start);
      video.removeEventListener("seeking", pump);
      video.removeEventListener("timeupdate", pump);
      video.removeEventListener("waiting", pump);
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(objectUrl);
    };
  }, [playlist, codecs]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      aria-label={title}
      controls
      playsInline
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );
}

/** Reads init + part URLs and their timings from an fMP4 VOD playlist. */
function parsePlaylist(text: string, base: URL) {
  let init = "";
  const parts: Part[] = [];
  let time = 0;
  let duration = 0;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("#EXT-X-MAP:")) {
      init = new URL(/URI="([^"]+)"/.exec(line)![1], base).href;
    } else if (line.startsWith("#EXTINF:")) {
      duration = parseFloat(line.slice(8));
    } else if (line && !line.startsWith("#")) {
      parts.push({ url: new URL(line, base).href, start: time, end: time + duration });
      time += duration;
    }
  }
  if (!init || !parts.length) throw new Error(`Not a segmented video playlist: ${base}`);
  return { init, parts };
}

/** Runs a SourceBuffer operation and resolves once the buffer has finished it. */
function whenIdle(sb: SourceBuffer, op: () => void | Promise<void>) {
  return new Promise<void>((resolve, reject) => {
    const run = async () => {
      const done = () => {
        sb.removeEventListener("updateend", done);
        sb.removeEventListener("error", fail);
        resolve();
      };
      const fail = () => {
        sb.removeEventListener("updateend", done);
        sb.removeEventListener("error", fail);
        reject(new Error("SourceBuffer error"));
      };
      sb.addEventListener("updateend", done);
      sb.addEventListener("error", fail);
      try {
        await op();
      } catch (error) {
        sb.removeEventListener("updateend", done);
        sb.removeEventListener("error", fail);
        reject(error);
      }
    };
    if (sb.updating) sb.addEventListener("updateend", () => void run(), { once: true });
    else void run();
  });
}

/** One cache per video, so a new version (…-v2) can replace the old one. */
function cacheNameFor(playlistPath: string) {
  const dir = playlistPath.slice(0, playlistPath.lastIndexOf("/"));
  return `segmented-video:${dir.replace(/-v\d+$/, "")}`;
}

/** Cache-first fetch: each part is downloaded from the server at most once per browser. */
async function cachedFetch(cacheName: string, url: string): Promise<ArrayBuffer> {
  let cache: Cache | undefined;
  try {
    cache = await caches.open(cacheName);
    const hit = await cache.match(url);
    if (hit) return await hit.arrayBuffer();
  } catch {
    // Cache Storage is unavailable (private mode, insecure origin): fall through to the network.
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  if (cache) {
    try {
      await cache.put(url, response.clone());
    } catch {
      // Storage full: still play the part, just don't keep it.
    }
  }
  return response.arrayBuffer();
}

/** Drops parts of older versions of this video from the cache. */
async function pruneCache(cacheName: string, playlist: URL) {
  try {
    const dir = new URL(".", playlist).href;
    const cache = await caches.open(cacheName);
    for (const request of await cache.keys()) {
      if (!request.url.startsWith(dir)) await cache.delete(request);
    }
  } catch {
    // Nothing to prune.
  }
}
