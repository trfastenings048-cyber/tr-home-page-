import type { SectionMeta } from "@/data/home";
import { Eyebrow } from "./Eyebrow";

/** Separator line + "01 · // LABEL · META" row. */
export function SectionHeader({ index, label, meta }: SectionMeta) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="h-px w-full bg-line" />
      <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[47.46fr_37.54fr_15fr]">
        <Eyebrow>{index}</Eyebrow>
        <Eyebrow>{label}</Eyebrow>
        <Eyebrow tone="muted" className="text-right md:text-left">
          {meta}
        </Eyebrow>
      </div>
    </div>
  );
}
