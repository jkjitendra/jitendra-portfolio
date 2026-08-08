import type { Metadata } from "next";

import Header from "@/components/Header";
import ContactPage from "@/app/contact/page";

export const metadata: Metadata = {
  title: "Contact · 2025 Classic · Jitendra Portfolio",
  robots: { index: false, follow: true },
};

export default function ClassicContactPage() {
  return <><Header forceClassic /><ContactPage /></>;
}
