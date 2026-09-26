import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

type EmbedViewProps = {
  src: string;
  title: string;
  backHref: string;
};

/** Full-screen external page (360 tours) with a back button floating on top. */
export function EmbedView({ src, title, backHref }: EmbedViewProps) {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-page">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 size-full border-0"
        allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
        allowFullScreen
      />
      <Link
        href={backHref}
        className="absolute top-[16px] right-[16px] z-10 flex items-center gap-[8px] rounded-full border border-white/20 bg-black/75 py-[10px] pr-[18px] pl-[14px] text-[14px] leading-[18px] font-medium text-white shadow-lg backdrop-blur transition-colors hover:bg-black md:top-[24px] md:right-[24px]"
      >
        <ArrowIcon className="size-[18px] -rotate-90" />
        Back
      </Link>
    </main>
  );
}
