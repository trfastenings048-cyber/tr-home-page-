import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

// Placeholder for Gotham Rounded (licensed). When the .woff2 files arrive,
// replace this with next/font/local using the same `variable`.
const gotham = Nunito({
  variable: "--font-gotham-src",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TR Fastenings",
  description:
    "TR, part of the Trifast plc Group, is a global leader in the design, engineering, manufacture and supply of fastenings and Category ‘C’ components.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gotham.variable} ${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
