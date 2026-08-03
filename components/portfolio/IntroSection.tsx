"use client";

import { motion, useReducedMotion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import ScrollCue from "./ScrollCue";

export default function IntroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="intro" className="portfolio-hero section-shell" aria-labelledby="intro-title">
      <div className="hero-circuit" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
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
          <ScrambleText text="Jitendra" duration={1800} /> <em><ScrambleText text="Kumar" duration={1800} delay={180} /></em><br /><ScrambleText text="Tiwari" duration={1800} delay={360} />
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
      <div className="hero-footer" aria-hidden="true">
        <ScrollCue side="left" /><span>01 / 06</span>
      </div>
    </section>
  );
}
