"use client";

import { motion } from "motion/react";

type WordRevealProps = {
  words: string[];
  className?: string;
  as?: "h1" | "h2" | "p";
};

/** Each word fades up in sequence (Framer "appear by word" effect). */
export function WordReveal({ words, className, as = "h2" }: WordRevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.12 }}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </Tag>
  );
}
