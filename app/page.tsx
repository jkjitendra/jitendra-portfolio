

import LandingPageClient from "@/components/LandingPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.jkjitendra.in',
  },
};

export default function Home() {
  return (
    <LandingPageClient />
  );
}

