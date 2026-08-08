import VersionArchive from "@/components/portfolio/VersionArchive";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.jkjitendra.in/home',
  },
};

export default function Home() {
  return <VersionArchive />;
}
