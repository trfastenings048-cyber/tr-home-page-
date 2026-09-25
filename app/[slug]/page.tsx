import Link from "next/link";
import { notFound } from "next/navigation";
import { solutions } from "@/data/home";

// Placeholder pages for the solution cards until real content exists.
export function generateStaticParams() {
  return solutions.items.map((item) => ({ slug: item.href.slice(1) }));
}

export const dynamicParams = false;

export default async function SolutionPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const item = solutions.items.find((s) => s.href === `/${slug}`);
  if (!item) notFound();

  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 px-[30px]">
      <p className="text-[12px] font-medium tracking-[0.8px] text-muted uppercase">{item.category}</p>
      <h1 className="text-[56px] leading-none font-bold tracking-[-1.6px] uppercase">{item.title}</h1>
      <p className="text-muted">Content coming soon.</p>
      <Link href="/" className="underline underline-offset-4">
        Back to home
      </Link>
    </main>
  );
}
