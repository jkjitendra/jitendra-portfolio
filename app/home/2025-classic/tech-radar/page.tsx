import type { Metadata } from "next";

import Header from "@/components/Header";
import TechRadar from "@/app/tech-radar/page";

export const metadata: Metadata = {
  title: "Tech Radar · 2025 Classic · Jitendra Portfolio",
  robots: { index: false, follow: true },
};

export default function ClassicTechRadarPage() {
  return <><Header forceClassic /><TechRadar /></>;
}
