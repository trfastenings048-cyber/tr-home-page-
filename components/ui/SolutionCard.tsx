import Image from "next/image";
import Link from "next/link";
import type { Solution } from "@/data/home";
import { ArrowIcon } from "@/components/icons";
import { IndexDots } from "./IndexDots";
import { PlaylistModal } from "./PlaylistModal";

const variants: Record<Solution["variant"], { card: string; bar: string; sizes: string }> = {
  large: { card: "lg:w-[678px] lg:h-[520px]", bar: "px-[18px]", sizes: "(min-width: 1024px) 678px, 100vw" },
  small: { card: "lg:w-[504px] lg:h-[387px]", bar: "px-[12px] pr-[18px]", sizes: "(min-width: 1024px) 504px, 100vw" },
  wide: { card: "lg:w-[690px] lg:h-[520px]", bar: "px-[24px]", sizes: "(min-width: 1024px) 690px, 100vw" },
};

type SolutionCardProps = Solution & { position: number };

export function SolutionCard({ title, category, href, image, playlists, variant, position }: SolutionCardProps) {
  const v = variants[variant];
  const className = `group flex aspect-[678/520] w-full flex-col overflow-hidden rounded-[10px] bg-card lg:aspect-auto ${v.card}`;

  const content = (
    <>
      <div className="relative h-[81%] w-full overflow-hidden rounded-t-[10px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes={v.sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className={`flex flex-1 items-center gap-6 lg:gap-[100px] ${v.bar}`}>
        <IndexDots active={position} />
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <p className="truncate text-[18px] leading-[22px] font-medium text-white">{title}</p>
          <p className="text-[12px] leading-[15px] font-medium tracking-[0.8px] text-muted uppercase">
            {category}
          </p>
        </div>
        {/* Arrow slides out and a copy slides in on hover */}
        <span className="relative size-[22px] shrink-0 overflow-hidden text-white">
          <ArrowIcon className="absolute inset-0 rotate-90 transition-transform duration-300 group-hover:translate-x-full" />
          <ArrowIcon className="absolute inset-0 -translate-x-full rotate-90 transition-transform duration-300 group-hover:translate-x-0" />
        </span>
      </div>
    </>
  );

  if (playlists) {
    return (
      <PlaylistModal playlists={playlists} title={title} className={className}>
        {content}
      </PlaylistModal>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
