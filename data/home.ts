// All home page content lives here. Sections only render what they receive.

export type SectionMeta = {
  index: string;
  label: string;
  meta: string;
};

export type Solution = {
  title: string;
  category: string;
  href: string;
  image: string;
  /** Layout variant matching the original Framer composition. */
  variant: "large" | "small" | "wide";
};

export type Testimonial = {
  headline: string;
  statement: string;
  name: string;
  role: string;
  avatar: string;
};

export const hero = {
  year: "©2026",
  intro:
    "TR, part of the Trifast plc Group, is a global leader in the design, engineering, manufacture and supply of fastenings and Category ‘C’ components. Supplying major assembly industries, we deliver innovative solutions that enhance efficiency and performance.",
  video: {
    // Placeholder until the real hero video is available.
    // Drop the file in /public/videos and set: src: "/videos/hero.mp4"
    src: undefined as string | undefined,
    poster: "/images/data-centre.png",
  },
};

export const solutions = {
  header: { index: "01", label: "// Solutions", meta: "2013 - 2025" } satisfies SectionMeta,
  title: ["Engineered", "Solutions"],
  description:
    "Explore TR Fastenings’ precision-engineered solutions, designed to connect, secure, and perform across industries worldwide.",
  items: [
    {
      title: "360 Virtual innovations",
      category: "Virtual walkthrough",
      href: "/360-virtual-innovations",
      image: "/images/virtual-innovations.png",
      variant: "large",
    },
    {
      title: "Data Centre innovation 360",
      category: "Data center",
      href: "/data-centre-innovation-360",
      image: "/images/data-centre.png",
      variant: "small",
    },
    {
      title: "TR Video Library",
      category: "Corporate stories",
      href: "/tr-video-library",
      image: "/images/video-library.png",
      variant: "wide",
    },
  ] satisfies Solution[],
};

export const testimonials = {
  header: { index: "03", label: "//Testimonial", meta: "Trusted partners" } satisfies SectionMeta,
  label: "STORIES",
  intro: "Stories from teams who found clarity, moved faster, and worked with less noise.",
  items: [
    {
      headline: "We cut weekly status meetings in half.",
      statement:
        "Northline made project updates visible, so decisions stopped getting buried and meetings became easier to cut.",
      name: "Mira Chen",
      role: "Head of Product",
      avatar: "/images/avatar-mira-chen.png",
    },
    {
      headline: "Our roadmap became obvious.",
      statement:
        "Now every priority, owner, and change is visible, so planning feels calmer and more precise.",
      name: "Daniel Reyes",
      role: "Startup Founder",
      avatar: "/images/avatar-daniel-reyes.png",
    },
    {
      headline: "Shipping finally feels clear.",
      statement:
        "Northline removed the friction between planning and execution. The team now moves with less context-chasing.",
      name: "Aanya Shah",
      role: "Operations Lead",
      avatar: "/images/avatar-aanya-shah.png",
    },
    {
      headline: "The team finally trusts the dashboard.",
      statement:
        "Now updates, timelines, blockers, and decisions live together, so the dashboard actually reflects reality.",
      name: "Julian Park",
      role: "Engineering Manager",
      avatar: "/images/avatar-julian-park.png",
    },
  ] satisfies Testimonial[],
};
