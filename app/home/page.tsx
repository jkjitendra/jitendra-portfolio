'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import caseStudyData from "@/data/case-studies.json";
import projects from "@/data/personal-projects.json";
import CompanyCarousel from "@/components/CompanyCarousel";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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

    // linear-gradient(to right, #6944a0, #19043b)    
    <main className="page-glow min-h-screen">
      <Header />

      {/* Mobile floating Theme FAB */}
      <div className="md:hidden fixed z-[9999] right-4 bottom-4">
        <ThemeSwitcher />
      </div>
      {/* Hero Section */}
      <section className="container-edge mt-10 text-center">
        <h1>
          Jitendra Kumar Tiwari
        </h1>
        <p
          className="mt-3"
          style={{ fontFamily: "monospace", minHeight: "1.6em", visibility: showSkills ? "visible" : "hidden" }}
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
        </p>
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

      {/* Projects Section */}
      <section className="container-edge mt-16 copy">
        <h2 className="text-3xl font-semibold mb-10 text-[rgb(var(--text))]">
          Projects
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <div className="card p-5" key={p.name}>
              <h3>{p.name}</h3>
              <p className="mt-2 opacity-90">{p.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {p.tech.map((t: string) => (
                  <span className="badge" key={t}>{t}</span>
                ))}
              </div>

              {p.demo.username && (
                <div className="mt-3 text-xs opacity-80">
                  Demo: <b>{p.demo?.username}</b> / <b>{p.demo?.password}</b>
                </div>
              )}

              <div className="mt-4 flex gap-3 text-sm">
                {p.github && (
                  <a
                    className="btn btn-sm btn-ghost hover:bg-blue-600 hover:text-white"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {p.live && (
                  <a
                    className="btn"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      {/* <section className="container-edge mt-12 copy">
        <h2>{caseStudyTitle}</h2>
        <ol className="mt-6 space-y-6">
          {caseStudies.map((c, j) => (
            <li
              key={c.title}
              className="card p-5"
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
            </li>
          ))}
        </ol>
      </section> */}

      <br />
      <Footer />
    </main>
  );
}