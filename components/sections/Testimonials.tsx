"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/data/home";
import { QuoteIcon } from "@/components/icons";
import { FadeIn } from "@/components/motion/FadeIn";
import { IconButton } from "@/components/ui/IconButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Testimonials() {
  const { items } = testimonials;
  const [index, setIndex] = useState(0);
  const current = items[index];
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);

  return (
    <section className="bg-page pb-[80px] font-inter md:pb-[129px]">
      <div className="px-[16px] pt-[47px] pb-[56px] font-gotham md:px-[30px]">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeader {...testimonials.header} />
        </div>
      </div>

      <FadeIn className="mx-auto flex max-w-[1060px] flex-col gap-[48px] px-[16px] md:flex-row md:px-0">
        {/* Sidebar */}
        <div className="flex flex-col justify-between gap-10 md:w-[506px]">
          <div className="flex flex-col gap-[24px]">
            <p className="text-[14px] leading-[14px] font-bold tracking-[0.84px] text-quiet">
              {testimonials.label}
            </p>
            <p className="text-[24px] leading-[30.72px] tracking-[-0.6px] text-white">{testimonials.intro}</p>
          </div>
          <div className="flex gap-[16px]">
            <IconButton direction="left" onClick={() => go(-1)} />
            <IconButton direction="right" onClick={() => go(1)} />
          </div>
        </div>

        {/* Card */}
        <div className="grid md:w-[506px]">
          <AnimatePresence initial={false}>
            <motion.figure
              key={index}
              className="flex flex-col gap-[32px] [grid-area:1/1]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              <blockquote className="flex flex-col gap-[24px]">
                <QuoteIcon className="size-6 text-quote" />
                <p className="text-[36px] leading-[43px] font-semibold tracking-[-1.44px] text-white md:text-[48px] md:leading-[57.6px]">
                  {current.headline}
                </p>
                <p className="text-[18px] leading-[28.8px] tracking-[-0.18px] text-white">{current.statement}</p>
              </blockquote>
              <figcaption className="flex flex-col gap-[12px]">
                <Image
                  src={current.avatar}
                  alt={current.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <p className="text-[16px] leading-[24px] text-white">
                  {current.name}, {current.role}
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </FadeIn>
    </section>
  );
}
