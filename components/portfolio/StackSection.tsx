"use client";

import { motion } from "framer-motion";
import radar from "@/data/tech-radar.json";
import skills from "@/data/skills-matrix.json";
import ScrambleText from "./ScrambleText";
import ScrollCue from "./ScrollCue";

const clusters = [
  { label: "LANGUAGES", values: ["Java", "TypeScript", "JavaScript", "Scala", "Python", "Go"] },
  { label: "BACKEND / DATA", values: ["Spring Boot", "Hibernate", "PostgreSQL", "MongoDB", "Cassandra", "Redis", "Apache Kafka"] },
  { label: "FRONTEND", values: ["React", "NextJS", "Redux", "TailwindCSS", "Vite"] },
  { label: "PLATFORM / QUALITY", values: ["Docker", "Kubernetes", "Jenkins", "AWS S3", "AWS Lambda", "SonarQube", "Grafana"] },
];

export default function StackSection() {
  return (
    <section id="stack" className="section-shell portfolio-section stack-section" aria-labelledby="stack-title">
      <div className="section-number" aria-hidden="true">04</div>
      <div className="section-label"><span /> <ScrambleText text="ENGINEERING.SYSTEMS" /></div>
      <div className="stack-heading">
        <div><p className="eyebrow"><ScrambleText text="TOOLKIT / CONTINUOUSLY EVOLVING" /></p><h2 id="stack-title"><ScrambleText text="The stack is not" duration={1900} /><br /><em><ScrambleText text="the strategy." duration={1850} delay={160} /></em></h2></div>
        <p>Tools are selected for the system in front of us: predictable delivery, observability, high performance, and a great experience for the people using it.</p>
      </div>
      <div className="stack-grid">
        {clusters.map((cluster, index) => (
          <motion.article key={cluster.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
            <div className="stack-card-header"><span>0{index + 1}</span><h3>{cluster.label}</h3></div>
            <div className="stack-tags">{cluster.values.map((value) => <span key={value}>{value}</span>)}</div>
          </motion.article>
        ))}
      </div>
      <div className="stack-footer">
        <div><span className="eyebrow">CORE PROFICIENCY</span>{skills.map((skill) => <p key={skill.skill}><span>{skill.skill}</span><b>{skill.level}</b></p>)}</div>
        <p className="radar-note">SYSTEM INVENTORY <strong>{Object.values(radar).flat().length}+</strong> technologies across delivery, data, platform, and product engineering.</p>
      </div>
      <ScrollCue side="left" />
    </section>
  );
}
