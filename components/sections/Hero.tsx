"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { hero } from "@/data/home";
import { ArrowDownIcon, TrLogo } from "@/components/icons";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden bg-page">
      <motion.div style={{ y }} className="relative size-full bg-hero">
        {/* Intro: black screen with the logo, then the video fades in */}
        <div className="absolute inset-0 bg-hero/80" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease }}
        >
          <BackgroundVideo src={hero.video.src} poster={hero.video.poster} />
        </motion.div>

        {/* Top loader bar */}
        <motion.div
          className="absolute top-0 left-0 z-10 h-[7px] w-full bg-brand"
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "0%", "100%"] }}
          transition={{ duration: 1.4, times: [0, 0.6, 1], ease: "easeInOut" }}
        />

        <div className="relative z-10 flex size-full flex-col justify-end p-[20px] md:p-[34px]">
          <div className="flex flex-col-reverse gap-10 md:flex-row md:items-end md:gap-[10px]">
            {/* Left: year + logo */}
            <div className="flex flex-1 flex-col gap-[30px]">
              <motion.h4
                className="text-[32px] leading-[28px] font-bold tracking-[-1px] text-snow md:text-[40px] md:leading-[34px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease }}
              >
                {hero.year}
              </motion.h4>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease }}
              >
                <TrLogo className="h-auto w-[180px] text-white md:w-[267px]" />
              </motion.div>
            </div>

            {/* Right: intro copy + scroll cue */}
            <div className="flex flex-col items-end gap-10 md:w-[380px] md:gap-[164px]">
              <motion.p
                className="max-w-[340px] text-[18px] leading-[22px] tracking-[-0.1px] text-snow md:mt-[67px] md:text-[20px] md:leading-[24px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6, ease }}
              >
                {hero.intro}
              </motion.p>
              <motion.a
                href="#solutions"
                aria-label="Scroll to solutions"
                className="hidden text-snow md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 1.8 },
                  y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
                }}
              >
                <ArrowDownIcon className="h-[30px] w-[31px]" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
