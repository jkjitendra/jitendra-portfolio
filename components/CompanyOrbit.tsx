"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

type Company = {
  name: string;
  logo: string;
  url: string;
  invertOnDark?: boolean;
};

export default function CompanyOrbit() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeCompany, setActiveCompany] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const companyList = companies as Company[];
  const angleStep = 360 / companyList.length;

  // Continuous rotation animation using requestAnimationFrame for smoother performance
  useEffect(() => {
    if (isPaused) return;

    let animationId: number;
    let lastTime = 0;
    const speed = 0.018; // rotation speed per millisecond

    const animate = (currentTime: number) => {
      if (lastTime === 0) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setRotation((prev) => (prev + speed * deltaTime) % 360);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Calculate 3D positions for each company
  const orbitPositions = useMemo(() => {
    return companyList.map((_, i) => {
      const baseAngle = (i * angleStep + rotation) * (Math.PI / 180);
      return {
        x: Math.sin(baseAngle),
        z: Math.cos(baseAngle),
      };
    });
  }, [rotation, companyList.length, angleStep]);

  const handleCompanyHover = (index: number | null) => {
    setIsPaused(index !== null);
    setActiveCompany(index);
  };

  return (
    <section className="mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container-edge"
      >
        {/* Section Title */}
        <motion.h2
          className="text-3xl font-semibold mb-8 text-center text-[rgb(var(--text))]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Companies I&apos;ve Worked With
        </motion.h2>

        {/* Orbit Container */}
        <div className="relative mx-auto h-[350px] sm:h-[400px] md:h-[450px] flex items-center justify-center">
          {/* Orbit Ring Visual */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] 
                         rounded-full border border-[rgb(var(--accent))/0.15] 
                         shadow-[0_0_60px_rgba(var(--accent),0.1),inset_0_0_60px_rgba(var(--accent),0.05)]"
              style={{
                background: "radial-gradient(circle, rgba(var(--accent), 0.02) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Subtle inner ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]
                         rounded-full border border-[rgb(var(--accent))/0.1]"
            />
          </div>

          {/* Center Label */}
          <motion.div
            className="absolute z-10 text-center"
            animate={{
              scale: isPaused ? 0.9 : 1,
              opacity: isPaused ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[rgb(var(--accent))/0.1] backdrop-blur-sm
                            border border-[rgb(var(--accent))/0.2] flex items-center justify-center
                            shadow-[0_0_40px_rgba(var(--accent),0.2)]">
              <span className="text-xs sm:text-sm font-medium text-[rgb(var(--text))/0.8]">
                4+ Years
              </span>
            </div>
          </motion.div>

          {/* Orbiting Company Logos */}
          {companyList.map((company, i) => {
            const pos = orbitPositions[i];
            const isActive = activeCompany === i;

            // 3D depth: z controls scale and opacity
            const scale = 0.7 + (pos.z + 1) * 0.25; // 0.7 to 1.2
            const opacity = 0.4 + (pos.z + 1) * 0.3; // 0.4 to 1.0
            const zIndex = Math.round((pos.z + 1) * 10);

            // Orbit radius
            const radiusX = 140; // Base orbit radius X
            const radiusY = 50;  // Compressed Y for 3D effect

            const src = company.logo.startsWith("/")
              ? company.logo
              : `/${company.logo.replace(/^\.?\/*/, "")}`;

            return (
              <motion.a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute cursor-pointer"
                style={{
                  left: "50%",
                  top: "50%",
                  zIndex: isActive ? 50 : zIndex,
                }}
                animate={{
                  x: pos.x * radiusX * (typeof window !== "undefined" && window.innerWidth < 640 ? 0.8 : 1.2),
                  y: pos.z * radiusY,
                  scale: isActive ? 1.4 : scale,
                  opacity: isActive ? 1 : opacity,
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 150,
                }}
                onMouseEnter={() => handleCompanyHover(i)}
                onMouseLeave={() => handleCompanyHover(null)}
                whileHover={{ scale: 1.5 }}
              >
                <motion.div
                  className={`
                    relative flex items-center justify-center
                    w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                    rounded-2xl bg-white/[0.08] backdrop-blur-md
                    border border-white/[0.15]
                    shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                    transition-all duration-300
                    ${isActive ? "ring-2 ring-[rgb(var(--accent))] shadow-[0_0_30px_rgba(var(--accent),0.3)]" : ""}
                  `}
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Glassmorphism shine */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent" />
                  </div>

                  <Image
                    src={src}
                    alt={company.name}
                    width={80}
                    height={80}
                    className={`
                      relative z-10 object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                      ${company.invertOnDark ? "dark:invert" : ""}
                    `}
                    loading="lazy"
                  />
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap
                                 px-4 py-2 rounded-lg bg-[rgb(var(--bg))] border border-[rgb(var(--accent))/0.3]
                                 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-md z-50"
                    >
                      <p className="text-sm font-semibold text-[rgb(var(--text))]">{company.name}</p>
                      <p className="text-xs text-[rgb(var(--text))/0.7] mt-0.5">Click to visit →</p>
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45
                                      bg-[rgb(var(--bg))] border-l border-t border-[rgb(var(--accent))/0.3]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            );
          })}

          {/* Floating particles for extra wow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[rgb(var(--accent))]"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Instruction hint */}
        <motion.p
          className="text-center text-sm text-[rgb(var(--text))/0.5] mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Hover to pause • Click to visit
        </motion.p>
      </motion.div>
    </section>
  );
}
