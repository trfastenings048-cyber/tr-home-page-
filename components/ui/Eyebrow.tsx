import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  tone?: "white" | "muted";
  className?: string;
};

/** 12px uppercase label used across section headers and card categories. */
export function Eyebrow({ children, tone = "white", className = "" }: EyebrowProps) {
  return (
    <p
      className={`font-gotham text-[12px] leading-[15px] font-medium tracking-[0.8px] uppercase ${
        tone === "muted" ? "text-muted" : "text-white"
      } ${className}`}
    >
      {children}
    </p>
  );
}
