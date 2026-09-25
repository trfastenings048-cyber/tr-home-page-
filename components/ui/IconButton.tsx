import type { ButtonHTMLAttributes } from "react";
import { ArrowIcon } from "@/components/icons";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: "left" | "right";
};

/** 40px round light button with an arrow (testimonial navigation). */
export function IconButton({ direction, className = "", ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={`flex size-10 items-center justify-center rounded-full bg-pill text-pill-icon transition-opacity hover:opacity-80 disabled:cursor-default ${className}`}
      {...rest}
    >
      <ArrowIcon className={`size-5 ${direction === "left" ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );
}
