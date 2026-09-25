import Image from "next/image";

type BackgroundVideoProps = {
  src?: string;
  poster: string;
  className?: string;
};

/** Muted looping cover video. Falls back to the poster image while no video is set. */
export function BackgroundVideo({ src, poster, className = "" }: BackgroundVideoProps) {
  if (!src) {
    return (
      <Image src={poster} alt="" fill priority sizes="100vw" className={`object-cover ${className}`} />
    );
  }
  return (
    <video
      className={`absolute inset-0 size-full object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
