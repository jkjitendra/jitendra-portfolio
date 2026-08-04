"use client";

import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";
import ScrambleText from "./ScrambleText";
import SectionDivider from "./SectionDivider";

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="section-shell portfolio-section experience-section" aria-labelledby="experience-title">
      <div className="section-label"><span /> <ScrambleText text="MISSION.LOG" /></div>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow"><ScrambleText text="CAREER / SIGNALS OF IMPACT" /></p>
          <h2 id="experience-title"><ScrambleText text="Making critical" duration={1900} /><br /><em><ScrambleText text="systems faster." duration={1900} delay={160} /></em></h2>
        </div>
        <p className="section-intro">Production engineering across media, banking, and telecom—where reliability is a product feature.</p>
      </div>
      <ol className="experience-timeline">
        {experienceData.experience.map((role, index) => (
          <motion.li
            key={role.name}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <div className="experience-marker" style={{ backgroundColor: role.color }} />
            <div className="experience-index">0{index + 1}</div>
            <div className="experience-title"><h3>{role.name}</h3><p>{role.role}</p></div>
            <ul>
              {role.points.slice(0, 3).map((point) => <li key={point}>{point}</li>)}
            </ul>
          </motion.li>
        ))}
      </ol>
      <SectionDivider side="left" />
    </section>
  );
}
