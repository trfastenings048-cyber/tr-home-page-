type IndexDotsProps = {
  /** How many dots are lit (1-based position of the card). */
  active: number;
  total?: number;
};

export function IndexDots({ active, total = 3 }: IndexDotsProps) {
  return (
    <div className="flex w-[42px] shrink-0 gap-[6px]" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`size-[10px] rounded-full ${i < active ? "bg-white" : "bg-dot"}`}
        />
      ))}
    </div>
  );
}
