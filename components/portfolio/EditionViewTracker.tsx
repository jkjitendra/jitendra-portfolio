"use client";

import { useEffect } from "react";

import type { PortfolioEditionSlug } from "@/data/portfolio-versions";

export default function EditionViewTracker({ edition }: { edition: PortfolioEditionSlug }) {
  useEffect(() => {
    void fetch(`/api/portfolio-metrics/${edition}/view`, { method: "POST", keepalive: true });
  }, [edition]);

  return null;
}
