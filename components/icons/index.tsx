import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function TrLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 267.074 199.05" fill="currentColor" aria-label="TR" role="img" {...props}>
      <path d="M 87.376 198.81 L 21.176 199.05 L 8.535 180.214 L 29.069 160.196 L 18.68 141.48 L 39.077 121.216 L 28.603 102.044 L 47.773 82.748 L 0 82.748 L 23.543 0 L 174.555 0.02 L 154.781 82.748 L 116.898 82.748 L 126.332 101.838 L 106.683 120.9 L 116.584 141.047 L 96.682 160.091 L 107.168 180.368 Z" />
      <path d="M 114.934 159.959 L 135.321 141.239 L 125.662 120.627 L 144.731 101.8 L 140.775 91.74 L 168.152 90.676 L 189.38 0.207 C 231.644 0.935 262.715 33.87 266.618 72.583 C 270.782 113.886 246.133 150.123 202.875 160.986 L 243.54 199.002 L 106.665 198.975 L 125.907 179.482 L 114.935 159.962 Z" />
    </svg>
  );
}

/** Material "arrow upward". Rotate it for other directions. */
export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 31 30" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M 14.031 19.808 L 14.031 4.746 L 16.969 4.746 L 16.969 19.808 L 24.033 12.972 L 26.096 15 L 15.5 25.254 L 4.904 15 L 6.967 12.972 Z" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  const block = "M 7.125 7.5 L 0.75 7.5 C 0.336 7.5 0 7.164 0 6.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 6.375 0 C 6.789 0 7.125 0.336 7.125 0.75 Z";
  const tail =
    "M 7.125 7.5 L 0.75 7.5 C 0.336 7.5 0 7.164 0 6.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 6.375 0 C 6.789 0 7.125 0.336 7.125 0.75 L 7.125 9 C 7.125 11.071 5.446 12.75 3.375 12.75";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {[3, 13.875].map((x) => (
        <g key={x} transform={`translate(${x} 6)`}>
          <path d={block} fill="currentColor" />
          <path
            d={tail}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}
