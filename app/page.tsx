'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import projects from "@/data/personal-projects.json";
import caseStudyData from "@/data/case-studies.json";
import experienceData from "@/data/experience.json";
import CompanyCarousel from "@/components/CompanyCarousel";


const skills = [
  "Full Stack", "Java", "Spring Boot", "React", "NextJs"
];

const { caseStudyTitle, caseStudies } = caseStudyData;
const { workExpTitle, experience } = experienceData;

export default function Home() {

  const [typedSkills, setTypedSkills] = useState<string[]>([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentTypedText, setCurrentTypedText] = useState("");
  const [showSkills, setShowSkills] = useState(false);



   useEffect(() => {
    if (!showSkills) return; // only start typing after name animation
    if (currentSkillIndex >= skills.length) return;

    const currentSkill = skills[currentSkillIndex];

    // Type next character
    if (currentTypedText.length < currentSkill.length) {
      const timeout = setTimeout(() => {
        setCurrentTypedText(currentSkill.slice(0, currentTypedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }

    // Once skill fully typed, pause briefly before moving to next
    const timeout = setTimeout(() => {
      setTypedSkills((prev) => [...prev, currentSkill]);
      setCurrentSkillIndex((prev) => prev + 1);
      setCurrentTypedText("");
    }, 800); // a bit longer pause feels smoother
    return () => clearTimeout(timeout);
  }, [currentTypedText, currentSkillIndex, showSkills]);

  
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="container-edge mt-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          onAnimationComplete={() => {
            // Add a short cinematic delay before typing starts
            setTimeout(() => setShowSkills(true), 600);
          }}
        >
          Jitendra Kumar Tiwari
        </motion.h1>
        {showSkills && (
          <p className="mt-3 text-white/80 text-lg" style={{fontFamily: "monospace"}}>
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
          </p>
        )}
        <style>
          {`
            .blinking-cursor {
              animation: blink 1s step-end infinite;
            }
            @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
          `}
        </style>
      </section>

      <CompanyCarousel />

      {/* Work Experience */}
      <section className="container-edge mt-16 copy">
        <h2 className="text-3xl font-semibold mb-10 text-[rgb(var(--text))]">
          {workExpTitle}
        </h2>
        <div className="space-y-10">
          {/* Experience Card */}
          {experience.map((exp, idx) => (
            <motion.div
              key={idx}
              className="experience-card bg-white/[0.05] border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:scale-[1.02] transition-transform duration-300"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="flex items-center gap-4">
                <img src={exp.logo} alt={exp.name} className="w-15 h-10 object-contain" />
                <div>
                  <h3 
                    className="font-semibold text-xl"
                    style={{
                      color: exp.color,
                      filter: 'brightness(var(--logo-brightness, 1))'
                    }}
                  >{exp.name}</h3>
                  <p className="text-sm opacity-70">{exp.role}</p>
                </div>
              </div>
              <ul className="mt-4 list-disc ml-6 text-[rgb(var(--text))]/80 leading-relaxed">
                {exp.points.map((p, i) => (
                  <li key={i}>
                    <span className="font-semibold">{p.split(":")[0]}</span>: <span className="">{p.split(":")[1]}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="container-edge mt-12 copy">
        <h2>{caseStudyTitle}</h2>
        <ol className="mt-6 space-y-6">
          {caseStudies.map((c, j) => (
            <motion.li
              key={c.title}
              className="card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 * j }}
              viewport={{ once: true }}
            >
              <h3>{c.title}</h3>
              <p className="mt-2 opacity-90">
                <b>Problem:</b> {c.problem}
              </p>
              <div className="mt-2">
                <p className="opacity-90"><b>Approach:</b></p>
                <ul className="mt-1 list-disc pl-5 opacity-90">
                  {c.approach.map((a: string) => <li key={a}>{a}</li>)}
                </ul>
              </div>
              <p className="mt-2 opacity-90">
                <b>Impact:</b> {c.impact}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  );
}
