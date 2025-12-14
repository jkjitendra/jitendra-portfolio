"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

function TiltCard({ company }: { company: any }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const src = company.logo.startsWith("/")
    ? company.logo
    : `/${company.logo.replace(/^\.?\/*/, "")}`;

  return (
    <motion.a
      ref={ref}
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md flex items-center justify-center cursor-pointer shadow-xl"
    >
      <div
        style={{
          transform: "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 flex items-center justify-center p-6"
      >
        <Image
          src={src}
          alt={company.name}
          width={100}
          height={100}
          className={`
            w-full h-full object-contain
            ${company.invertOnDark ? "dark:invert" : ""}
          `}
        />
      </div>

      {/* Gloss effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl pointer-events-none" />
    </motion.a>
  );
}

export default function ParallaxCards() {
  return (
    <div className="flex flex-wrap justify-center gap-10 py-20 px-4 perspective-[1000px]">
      {companies.map((company, i) => (
        <TiltCard key={i} company={company} />
      ))}
    </div>
  );
}
