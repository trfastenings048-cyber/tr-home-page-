#!/usr/bin/env bash
# Re-encode a large master video for the web and split it into N fragmented-MP4 parts
# (HLS/fMP4: init.mp4 + part-00.m4s … part-NN.m4s + index.m3u8).
#
# Every part is far below GitHub's 100 MB limit, and the player in
# components/ui/SegmentedVideo.tsx plays them back in order.
#
# Usage: scripts/split-video.sh <input.mp4> <output-dir> [parts=10]
# Example:
#   scripts/split-video.sh "media-source/TR Fastening Video 1080p.mp4" public/videos/tr-fastening-v1 10
#
# Bump the output folder version (v1 -> v2) whenever the video changes: the parts are
# served with an immutable cache header, so a new URL is the only way to bust caches.
set -euo pipefail

in="$1"
out="$2"
parts="${3:-10}"

duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
seg=$(awk -v d="$duration" -v n="$parts" 'BEGIN { printf "%.3f", d / n }')

rm -rf "$out"
mkdir -p "$out"

# High profile / level 4.0 => codec string avc1.640028, AAC-LC => mp4a.40.2.
# A keyframe is forced at every part boundary so each part starts cleanly.
ffmpeg -hide_banner -y -i "$in" \
  -map 0:v:0 -map 0:a:0? \
  -c:v libx264 -preset slow -crf 23 -maxrate 5M -bufsize 10M \
  -profile:v high -level:v 4.0 -pix_fmt yuv420p -r 30 \
  -force_key_frames "expr:gte(t,n_forced*${seg})" -sc_threshold 0 \
  -c:a aac -b:a 128k -ac 2 \
  -f hls -hls_time "$seg" -hls_playlist_type vod \
  -hls_segment_type fmp4 -hls_flags independent_segments \
  -hls_fmp4_init_filename init.mp4 \
  -hls_segment_filename "$out/part-%02d.m4s" \
  "$out/index.m3u8"

ls -lh "$out"
