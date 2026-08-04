"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const sections = [
  ["about", "About"],
  ["experience", "Experience"],
  ["work", "Work"],
  ["stack", "Stack"],
  ["contact", "Contact"],
] as const;

export default function SectionNav() {
  const [active, setActive] = useState("intro");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55%", threshold: [0.01, 0.2, 0.5] },
    );

    ["intro", ...sections.map(([id]) => id)].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="portfolio-nav">
      <a className="portfolio-wordmark" href="#intro" aria-label="Back to intro">
        <Image className="portfolio-wordmark-logo" src="/logos/jk_favicon.png" width={192} height={192} alt="Jitendra Logo" priority />
      </a>

      <button
        className="portfolio-menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="portfolio-navigation"
      >
        <span>{open ? "[ CLOSE ]" : "[ MENU ]"}</span>
      </button>

      <nav id="portfolio-navigation" className={open ? "portfolio-links is-open" : "portfolio-links"} aria-label="Portfolio sections">
        {sections.map(([id, label], index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <a className="portfolio-resume-link" href="/jitendra_resume.pdf" target="_blank" rel="noreferrer">
          Resume <span>↗</span>
        </a>
      </nav>
    </header>
  );
}
