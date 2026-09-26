import { testimonials } from "@/data/home";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Testimonials() {
  const { video } = testimonials;

  return (
    <section className="bg-page pb-[80px] font-inter md:pb-[129px]">
      <div className="px-[16px] pt-[47px] pb-[56px] font-gotham md:px-[30px]">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeader {...testimonials.header} />
        </div>
      </div>

      <FadeIn className="mx-auto max-w-[1120px] px-[16px] md:px-[30px]">
        <video
          className="aspect-video w-full rounded-[10px] bg-card object-cover"
          src={video.src}
          poster={video.poster}
          aria-label={video.title}
          controls
          playsInline
          preload="metadata"
        />
      </FadeIn>
    </section>
  );
}
