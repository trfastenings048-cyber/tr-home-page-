"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { LibraryVideo, Playlist } from "@/data/videoLibrary";

type PlaylistModalProps = {
  playlists: Playlist[];
  title: string;
  className?: string;
  children: ReactNode;
};

const scrollbar = "[scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin]";

/** Renders children as a trigger button that opens a YouTube video library in a popup. */
export function PlaylistModal({ playlists, title, className = "", children }: PlaylistModalProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<LibraryVideo | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const playlist = playlists[active];
  // True only in the browser, where document.body exists for the portal.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectPlaylist = (i: number) => {
    setActive(i);
    setPlaying(null);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const play = (video: LibraryVideo) => {
    setPlaying(video);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${title}`}
        className={`text-left ${className}`}
      >
        {children}
      </button>

      {/* Portal to <body> so animated (transformed) parents can't trap the fixed overlay */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-[12px] md:p-[32px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  className="flex h-full max-h-[880px] w-full max-w-[1360px] flex-col overflow-hidden rounded-[12px] border border-line bg-hero font-gotham"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.96, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-line px-[16px] py-[14px] md:px-[24px]">
                    <div className="min-w-0">
                      <p className="text-[12px] leading-[15px] font-medium tracking-[0.8px] text-muted uppercase">
                        {title}
                      </p>
                      <p className="truncate text-[18px] leading-[24px] font-medium text-white md:text-[20px]">
                        {playlist.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-white/10 text-[22px] leading-none text-white transition-colors hover:bg-white/20"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                    {/* Playlists: horizontal chips on mobile, sidebar on desktop */}
                    <nav
                      aria-label="Playlists"
                      className={`shrink-0 border-b border-line lg:w-[300px] lg:overflow-y-auto lg:border-r lg:border-b-0 ${scrollbar}`}
                    >
                      <ul className={`flex gap-[8px] overflow-x-auto p-[10px] lg:flex-col lg:gap-[2px] ${scrollbar}`}>
                        {playlists.map((p, i) => (
                          <li key={p.id} className="shrink-0 lg:shrink">
                            <button
                              type="button"
                              onClick={() => selectPlaylist(i)}
                              aria-current={i === active}
                              className={`flex w-full flex-col gap-[2px] rounded-[8px] px-[12px] py-[9px] text-left whitespace-nowrap transition-colors lg:whitespace-normal ${
                                i === active
                                  ? "bg-brand text-white"
                                  : "bg-white/5 text-snow/75 hover:bg-white/10 hover:text-white lg:bg-transparent"
                              }`}
                            >
                              <span className="text-[14px] leading-[18px] font-medium lg:line-clamp-2">{p.title}</span>
                              <span
                                className={`text-[12px] leading-[15px] ${i === active ? "text-white/70" : "text-muted"}`}
                              >
                                {p.videos.length} videos
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    {/* Player + every video in the playlist */}
                    <div ref={mainRef} className={`min-h-0 flex-1 overflow-y-auto p-[12px] md:p-[24px] ${scrollbar}`}>
                      {playing && (
                        <div className="mb-[28px]">
                          <div className="overflow-hidden rounded-[10px] bg-black">
                            <iframe
                              key={playing.id}
                              className="block aspect-video w-full"
                              src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`}
                              title={playing.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                          <p className="mt-[12px] text-[18px] leading-[24px] font-medium text-white">{playing.title}</p>
                        </div>
                      )}

                      <p className="mb-[14px] text-[12px] leading-[15px] font-medium tracking-[0.8px] text-muted uppercase">
                        {playlist.videos.length} videos
                      </p>
                      <ul className="grid grid-cols-1 gap-x-[16px] gap-y-[22px] sm:grid-cols-2 xl:grid-cols-3">
                        {playlist.videos.map((video) => {
                          const isPlaying = playing?.id === video.id;
                          return (
                            <li key={video.id}>
                              <button
                                type="button"
                                onClick={() => play(video)}
                                className="group/video w-full text-left"
                              >
                                <div
                                  className={`relative aspect-video overflow-hidden rounded-[8px] bg-card ring-2 transition ${
                                    isPlaying ? "ring-brand" : "ring-transparent"
                                  }`}
                                >
                                  <Image
                                    src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1280px) 320px, (min-width: 640px) 45vw, 100vw"
                                    className="object-cover transition-transform duration-500 group-hover/video:scale-105"
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/video:bg-black/30">
                                    <span className="flex size-[44px] items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover/video:opacity-100">
                                      <svg
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="ml-[2px] size-[20px]"
                                        aria-hidden="true"
                                      >
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </span>
                                  </span>
                                  {video.duration && (
                                    <span className="absolute right-[6px] bottom-[6px] rounded-[4px] bg-black/80 px-[5px] py-[1px] text-[12px] leading-[16px] font-medium text-white">
                                      {isPlaying ? "Now playing" : video.duration}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`mt-[10px] line-clamp-2 text-[14px] leading-[19px] ${
                                    isPlaying ? "text-white" : "text-snow/85 group-hover/video:text-white"
                                  }`}
                                >
                                  {video.title}
                                </p>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
