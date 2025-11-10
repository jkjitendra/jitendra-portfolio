'use client';

import { useState } from "react";
import LandingCard from "@/components/LandingCard";

export default function Home() {

  const [showMain, setShowMain] = useState(false);

  if (!showMain) {
    return (
      <LandingCard onEnter={() => setShowMain(true)} />
    );
  }
}
