import { solutions } from "@/data/home";
import { FadeIn } from "@/components/motion/FadeIn";
import { WordReveal } from "@/components/motion/WordReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/ui/SolutionCard";

export function Solutions() {
  const [first, second, third] = solutions.items;

  return (
    <section id="solutions" className="bg-page px-[16px] py-[64px] md:px-[30px] md:py-[100px]">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-[48px] md:gap-[80px]">
        <div className="flex flex-col gap-[40px] md:gap-[70px]">
          <SectionHeader {...solutions.header} />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <WordReveal
              words={solutions.title}
              className="max-w-[700px] text-[56px] leading-[52px] font-bold tracking-[-1.6px] text-white uppercase md:text-[103px] md:leading-[90px]"
            />
            <FadeIn delay={0.3} y={20} className="md:w-[260px]">
              <p className="text-[18px] leading-[22px] text-white">{solutions.description}</p>
            </FadeIn>
          </div>
        </div>

        <div className="flex flex-col gap-[20px] lg:gap-[140px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <FadeIn>
              <SolutionCard {...first} position={1} />
            </FadeIn>
            <FadeIn delay={0.15}>
              <SolutionCard {...second} position={2} />
            </FadeIn>
          </div>
          <div className="flex justify-center">
            <FadeIn className="w-full lg:w-auto">
              <SolutionCard {...third} position={3} />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
