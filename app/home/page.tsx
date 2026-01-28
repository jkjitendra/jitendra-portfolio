import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.jkjitendra.in/home',
  },
};

export default function Home() {
  return <HomeClient />;
}