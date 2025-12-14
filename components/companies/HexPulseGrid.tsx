"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

export default function HexPulseGrid() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
        {companies.map((company, i) => {
          const src = company.logo.startsWith("/")
            ? company.logo
            : `/${company.logo.replace(/^\.?\/*/, "")}`;
          return (
            <motion.a
              key={i}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-28 h-32 sm:w-32 sm:h-36 flex items-center justify-center group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Hexagon Shape using SVG */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 100 115" className="w-full h-full fill-white/[0.03] stroke-white/[0.1] stroke-[2px] transition-all duration-300 group-hover:stroke-[rgb(var(--accent))] group-hover:fill-[rgb(var(--accent))/0.1]">
                  <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" />
                </svg>
              </div>

              {/* Pulse Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 100 115" className="w-full h-full fill-none stroke-[rgb(var(--accent))] stroke-[2px]">
                  <motion.path
                    d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </svg>
              </div>

              <div className="relative z-10 p-4">
                <Image
                  src={src}
                  alt={company.name}
                  width={80}
                  height={80}
                  className={`
                      w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300
                      ${company.invertOnDark ? "dark:invert" : ""}
                    `}
                />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
