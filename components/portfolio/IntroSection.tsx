"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import ScrambleText from "./ScrambleText";
import SectionDivider from "./SectionDivider";

const amberParticles = Array.from({ length: 20 }, (_, index) => ({
  left: (index * 37 + 7) % 100,
  bottom: -8 - (index % 5) * 7,
  riseDuration: 30 + (index % 6) * 4,
  riseDelay: -(index * 2.35),
  swayDuration: 7 + (index % 5) * 1.8,
  swayDelay: -(index * 1.1),
  size: 2 + (index % 3) * 2,
  opacity: 0.15 + (index % 5) * 0.05,
  isDiamond: index % 3 === 0,
}));

const gridIntersections = [
  [8, 12], [17, 25], [28, 9], [39, 38], [51, 17], [63, 31], [74, 11], [87, 27],
  [11, 61], [23, 78], [36, 55], [48, 83], [59, 67], [71, 48], [82, 73], [93, 58],
];

export default function IntroSection() {
  const reduceMotion = useReducedMotion();
  const [activeGridLights, setActiveGridLights] = useState<number[]>([]);

  useEffect(() => {
    if (reduceMotion) return;

    let active = true;
    let nextPulse = 0;
    let clearPulse = 0;
    const schedulePulse = () => {
      nextPulse = window.setTimeout(() => {
        if (!active) return;
        const first = Math.floor(Math.random() * gridIntersections.length);
        const second = Math.floor(Math.random() * gridIntersections.length);
        setActiveGridLights(Math.random() > 0.72 && second !== first ? [first, second] : [first]);
        clearPulse = window.setTimeout(() => setActiveGridLights([]), 650);
        schedulePulse();
      }, 1800 + Math.random() * 3200);
    };

    schedulePulse();
    return () => {
      active = false;
      window.clearTimeout(nextPulse);
      window.clearTimeout(clearPulse);
    };
  }, [reduceMotion]);

  return (
    <section id="intro" className="portfolio-hero portfolio-hero--centered section-shell" aria-labelledby="intro-title">
      <div className="hero-circuit" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
      </div>
      <div className="hero-grid-accents" aria-hidden="true">
        <span className="hero-grid-scan" />
        {gridIntersections.map(([left, top], index) => <i className={activeGridLights.includes(index) ? "is-active" : undefined} key={index} style={{ left: `${left}%`, top: `${top}%` }} />)}
      </div>
      <div className="amber-drift" aria-hidden="true">
        {amberParticles.map((particle, index) => (
          <span
            className="amber-drift-particle"
            key={index}
            style={{
              left: `${particle.left}%`,
              bottom: `${particle.bottom}%`,
              animationDuration: `${particle.riseDuration}s`,
              animationDelay: `${particle.riseDelay}s`,
            }}
          >
            <i
              className={particle.isDiamond ? "is-diamond" : undefined}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDuration: `${particle.swayDuration}s`,
                animationDelay: `${particle.swayDelay}s`,
              }}
            />
          </span>
        ))}
      </div>
      {/* <motion.p
        className="eyebrow hero-status"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className="status-pip" /> AVAILABLE FOR SELECTED OPPORTUNITIES · BENGALURU, INDIA
      </motion.p> */}

      <div className="hero-copy">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScrambleText text="[ ENGINEERING SYSTEMS / HUMAN-CENTRED PRODUCTS ]" />
        </motion.p>
        <motion.h1
          id="intro-title"
          initial={{ opacity: 0, y: 34, filter: reduceMotion ? "none" : "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.2 }}
        >
          <ScrambleText
            text="Jitendra Kumar Tiwari"
            duration={2600}
            emphasisRanges={[{ start: 9, end: 14 }]}
          />
        </motion.h1>
        <motion.p
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.7 }}
        >
          <ScrambleText text="FULL-STACK ENGINEER · JAVA · SPRING BOOT · REACT" duration={2500} delay={420} />
        </motion.p>
      </div>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.85 }}
      >
        <a className="signal-button" href="#contact">Let&apos;s work together <span>↘</span></a>
        <a className="text-button" href="#work">Explore selected work <span>↓</span></a>
      </motion.div>
      <SectionDivider side="left" />
    </section>
  );
}
