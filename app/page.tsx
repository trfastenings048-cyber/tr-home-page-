import { Hero } from "@/components/sections/Hero";
import { Solutions } from "@/components/sections/Solutions";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Solutions />
      <Testimonials />
    </main>
  );
}
