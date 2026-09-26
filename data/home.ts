// All home page content lives here. Sections only render what they receive.

import { videoLibrary, type Playlist } from "./videoLibrary";

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
  /** External page shown full screen (with a back button) at `href`. */
  embed?: string;
  /** When set, clicking the card opens these YouTube playlists in a popup instead of navigating. */
  playlists?: Playlist[];
  /** Layout variant matching the original Framer composition. */
  variant: "large" | "small" | "wide";
};

export const hero = {
  year: "©2026",
  intro:
    "TR, part of the Trifast plc Group, is a global leader in the design, engineering, manufacture and supply of fastenings and Category ‘C’ components. Supplying major assembly industries, we deliver innovative solutions that enhance efficiency and performance.",
  video: {
    src: "/videos/tr-corporate-overview-2026.mp4" as string | undefined,
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
      embed: "https://storage.net-fs.com/hosting/8110829/2/",
      image: "/images/virtual-innovations.png",
      variant: "large",
    },
    {
      title: "Data Centre innovation 360",
      category: "Data center",
      href: "/data-centre-innovation-360",
      embed: "https://storage.net-fs.com/hosting/8110829/5/",
      image: "/images/data-centre.png",
      variant: "small",
    },
    {
      title: "TR Video Library",
      category: "Corporate stories",
      href: "https://www.youtube.com/@TRFasteningsYT/playlists",
      image: "/images/video-library.png",
      playlists: videoLibrary,
      variant: "wide",
    },
  ] satisfies Solution[],
};

export const testimonials = {
  header: { index: "03", label: "//Testimonial", meta: "Trusted partners" } satisfies SectionMeta,
  video: {
    src: "/videos/grant-testimonial.mp4",
    poster: "/images/video-library.png",
    title: "Grant testimonial",
  },
};
