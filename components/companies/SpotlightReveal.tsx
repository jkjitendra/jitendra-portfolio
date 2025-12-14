"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import companies from "@/data/companies.json";

export default function SpotlightReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto py-20 px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      {/* The cards */}
      {companies.map((company, i) => (
        <CompanyCard key={i} company={company} />
      ))}

      {/* Spotlight Overlay */}
      {/* This overlay creates the "darkness" except where the spotlight is. */}
      {/* Better approach: Cards are dark by default, and we have a glowing radial gradient that moves on TOP of them with mix-blend-mode or just simple opacity masking. 
          Alternatively, simpler method: Use radial-gradient on the container background that tracks mouse.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--accent), 0.15), transparent 40%)`,
        }}
      />
    </div>
  );
}

function CompanyCard({ company }: { company: any }) {
  const src = company.logo.startsWith("/")
    ? company.logo
    : `/${company.logo.replace(/^\.?\/*/, "")}`;
  return (
    <div className="relative group rounded-xl border border-white/[0.1] bg-white/[0.02] p-8 flex items-center justify-center overflow-hidden hover:bg-white/[0.05] transition-colors duration-300">
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,transparent)]" />

      {/* Logo - Dimmed by default, bright on hover */}
      <Image
        src={src}
        alt={company.name}
        width={80}
        height={80}
        className={`
                    w-16 h-16 object-contain transition-all duration-300
                    grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110
                     ${company.invertOnDark ? "dark:invert" : ""}
                `}
      />
    </div>
  )
}
