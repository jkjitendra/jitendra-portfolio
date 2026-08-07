"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import SectionDivider from "./SectionDivider";

export default function AboutSection() {
  return (
    <section id="about" className="section-shell portfolio-section about-section" aria-labelledby="about-title">
      <div className="section-label"><span /> PROFILE.DOSSIER</div>
      <div className="about-layout">
        <motion.div
          className="profile-dossier"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
        >
          <div className="profile-image-wrap">
            <Image src="/logos/image.jpg" alt="Jitendra Kumar Tiwari" fill sizes="(max-width: 479px) calc(100vw - 2rem), (max-width: 767px) 23rem, (max-width: 1023px) 38vw, 360px" className="profile-image" />
            <span className="profile-badge">Jitendra/01</span>
          </div>
          <div className="profile-meta">
            <p>ROLE <strong>TEAM LEAD</strong></p>
            <p>BASE <strong>BENGALURU, INDIA</strong></p>
            <p>MODE <strong>BUILD · LEARN · IMPROVE</strong></p>
          </div>
        </motion.div>
        <div className="about-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><ScrambleText text="ABOUT / THE OPERATOR" /></motion.p>
          <motion.h2 id="about-title" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <ScrambleText text="Systems that stay calm" duration={2100} wrapByWords /> <em><ScrambleText text="under pressure." duration={1900} delay={180} /></em>
          </motion.h2>
          <motion.div className="about-prose" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p>I&apos;m a full-stack engineer focused on building dependable software where performance, clarity, and maintainability work together.</p>
            <p>From high-traffic APIs and event-driven services to carefully considered user interfaces, I turn complex product requirements into systems that are easier to operate and better to use.</p>
          </motion.div>
          <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span>“</span>I build reliable systems that make complex products feel simple.<span>”</span>
          </motion.blockquote>
          <div className="about-stats">
            <div><strong>5+</strong><span>YEARS BUILDING</span></div>
            <div><strong>3</strong><span>PRODUCT TEAMS</span></div>
            <div><strong>100ms</strong><span>API LATENCY ACHIEVED</span></div>
          </div>
        </div>
      </div>
      <SectionDivider side="right" />
    </section>
  );
}
