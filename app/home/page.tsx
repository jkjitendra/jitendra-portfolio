'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SolarSystem from "@/components/SolarSystem";
import MouseGradient from "@/components/MouseGradient";
import projects from "@/data/personal-projects.json";

const skills = [
  "Full Stack", "Java", "Spring Boot", "React", "NextJs"
];


let hasAnimated = false;

export default function Home() {

  const [typedSkills, setTypedSkills] = useState<string[]>(hasAnimated ? skills : []);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(hasAnimated ? skills.length : 0);
  const [currentTypedText, setCurrentTypedText] = useState("");
  const [showSkills, setShowSkills] = useState(true);

  useEffect(() => {
    if (!showSkills) return; // only start typing after name animation
    if (currentSkillIndex >= skills.length) return;

    const currentSkill = skills[currentSkillIndex];

    // Type next character
    if (currentTypedText.length < currentSkill.length) {
      const timeout = setTimeout(() => {
        setCurrentTypedText(currentSkill.slice(0, currentTypedText.length + 1));
      }, 60);
      return () => clearTimeout(timeout);
    }

    // Once skill fully typed, pause briefly before moving to next
    const timeout = setTimeout(() => {
      setTypedSkills((prev) => [...prev, currentSkill]);
      setCurrentSkillIndex((prev) => prev + 1);
      setCurrentTypedText("");
    }, 700); // a bit longer pause feels smoother
    return () => clearTimeout(timeout);
  }, [currentTypedText, currentSkillIndex, showSkills]);

  useEffect(() => {
    if (!hasAnimated) {
      hasAnimated = true;
    }
  }, []);

  return (
    <main className="page-glow min-h-screen">
      {/* Mouse-following gradient background */}
      <MouseGradient />



      {/* Hero Section - Enhanced */}
      <motion.section
        className="container-edge mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated gradient background for hero */}
        <div className="relative">
          {/* Subtle glow behind title */}
          <motion.div
            className="absolute inset-0 -z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div
              className="w-[500px] h-[200px] rounded-full opacity-30 blur-3xl"
              style={{
                background: "radial-gradient(ellipse, rgb(var(--accent)) 0%, transparent 70%)",
              }}
            />
          </motion.div>

          <motion.h1
            className="hero-gradient-text breathing-text relative z-10"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Jitendra Kumar Tiwari
          </motion.h1>
        </div>

        <motion.p
          className="mt-3"
          style={{ fontFamily: "monospace", minHeight: "1.6em", visibility: showSkills ? "visible" : "hidden" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Render typed skills, separated */}
          {typedSkills.map((skill, idx) => (
            <span key={skill}>
              {skill}
              {/* Add separator only if this is NOT the last completed skill or if not currently typing last skill */}
              {(idx < typedSkills.length - 1 || currentSkillIndex < skills.length) && ' | '}
            </span>
          ))}
          {/* Render current typing word, only if we have more to type */}
          {currentSkillIndex < skills.length && (
            <span>
              {currentTypedText}
              <span className="blinking-cursor">|</span>
            </span>
          )}
        </motion.p>
        <style>
          {`
            .blinking-cursor {
              animation: blink 1s step-end infinite;
            }
            @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
          `}
        </style>
      </motion.section>

      {/* Companies Section - Solar System View */}
      <section className="py-8 overflow-hidden">
        <SolarSystem />
      </section>

      {/* Projects Section - Enhanced with 3D Cards */}
      <motion.section
        className="container-edge mt-16 copy"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-semibold mb-10 text-[rgb(var(--text))]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map((p, index) => (
            <ProjectCard key={p.name} project={p} index={index} />
          ))}
        </div>
      </motion.section>

      <br />

      {/* Footer with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Footer />
      </motion.div>
    </main>
  );
}