"use client";

import { useState } from "react";
import LandingCard from "@/components/LandingCard";
import ShowcaseSwitcher from "@/components/companies/ShowcaseSwitcher";

export default function Home() {

  const [showMain, setShowMain] = useState(false);

  if (!showMain) {
    return (
      <LandingCard onEnter={() => setShowMain(true)} />
    );
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <ShowcaseSwitcher />
    </main>
  );
}
