"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

export default function RollingCylinder() {
  // We need duplications to fill the cylinder
  // Let's create a sufficient number of faces
  const faces = [...companies, ...companies];
  const faceCount = faces.length;
  const faceWidth = 140; // Approx px width of each face
  // Calculate radius needed to fit all faces: C = 2 * pi * r => r = C / (2 * pi)
  // C = faceCount * faceWidth
  const radius = (faceCount * faceWidth) / (2 * Math.PI);

  return (
    <div className="relative h-[400px] flex items-center justify-center overflow-hidden perspective-[1000px]">
      {/* Container that spins */}
      <motion.div
        className="relative flex items-center justify-center transform-style-3d"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
          width: faceWidth,
          height: 100,
        }}
      >
        {faces.map((company, i) => {
          // Calculate angle for each face
          const angle = (360 / faceCount) * i;
          const src = company.logo.startsWith("/")
            ? company.logo
            : `/${company.logo.replace(/^\.?\/*/, "")}`;

          return (
            <div
              key={`${company.name}-${i}`}
              className="absolute flex items-center justify-center backface-visible"
              style={{
                width: faceWidth,
                height: 100,
                // Rotate to correct angle, then push out by radius
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <div className="w-[100px] h-[80px] bg-white/[0.05] border border-white/[0.1] rounded-xl backdrop-blur-sm flex items-center justify-center p-4 hover:bg-[rgb(var(--accent))/0.2] transition-colors duration-300">
                <Image
                  src={src}
                  alt={company.name}
                  width={80}
                  height={80}
                  className={`
                    object-contain w-full h-full opacity-80
                    ${company.invertOnDark ? "dark:invert" : ""}
                  `}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Fade gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--bg))] via-transparent to-[rgb(var(--bg))] pointer-events-none" />
    </div>
  );
}
