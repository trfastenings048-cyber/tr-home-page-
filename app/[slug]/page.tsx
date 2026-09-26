import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions } from "@/data/home";
import { EmbedView } from "@/components/sections/EmbedView";

// Full-screen pages for solution cards that embed an external experience (360 tours).
const embedded = solutions.items.filter((item) => item.embed);

export function generateStaticParams() {
  return embedded.map((item) => ({ slug: item.href.slice(1) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = embedded.find((s) => s.href === `/${slug}`);
  return { title: item ? `${item.title} | TR Fastenings` : "TR Fastenings" };
}

export default async function EmbedPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const item = embedded.find((s) => s.href === `/${slug}`);
  if (!item) notFound();

  return <EmbedView src={item.embed!} title={item.title} backHref="/#solutions" />;
}
