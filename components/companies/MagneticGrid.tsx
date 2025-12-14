"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

function MagneticItem({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export default function MagneticGrid() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 place-items-center">
        {companies.map((company, i) => {
          const src = company.logo.startsWith("/")
            ? company.logo
            : `/${company.logo.replace(/^\.?\/*/, "")}`;

          return (
            <MagneticItem key={i}>
              <motion.a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 h-24 sm:w-32 sm:h-32 bg-white/[0.03] rounded-3xl flex items-center justify-center 
                             border border-white/[0.1] backdrop-blur-sm group hover:border-[rgb(var(--accent))/0.5] hover:bg-[rgb(var(--accent))/0.05] transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
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
              </motion.a>
            </MagneticItem>
          )
        })}
      </div>
    </div>
  );
}
