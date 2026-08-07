"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import projects from "@/data/personal-projects.json";
import ScrambleText from "./ScrambleText";
import SectionDivider from "./SectionDivider";

type Project = (typeof projects)[number];
type Category = "All" | "Full Stack" | "Backend & APIs" | "Frontend" | "Open Source";

const categories: Category[] = ["All", "Full Stack", "Backend & APIs", "Frontend", "Open Source"];
const containedPreviewProjects = new Set([
  "Blog App",
  "Error Sound Alert (JetBrains Plugin)"
]);
const categoryFor = (project: Project): Exclude<Category, "All">[] => {
  const tech = project.tech.join(" ").toLowerCase();
  const output: Exclude<Category, "All">[] = ["Open Source"];
  if (/spring|java|postgresql|python/.test(tech)) output.push("Backend & APIs");
  if (/react|typescript|javascript|chrome|pwa/.test(tech)) output.push("Frontend");
  if (/spring|react|electron|pwa/.test(tech)) output.push("Full Stack");
  return output;
};

export default function ProjectIndex() {
  const [active, setActive] = useState<Category>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtered = active === "All" ? projects : projects.filter((project) => categoryFor(project).includes(active));

  useEffect(() => {
    if (!selected) {
      openerRef.current?.focus();
      return;
    }

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <section id="work" className="section-shell portfolio-section work-section" aria-labelledby="work-title">
      <div className="section-label"><span /> <ScrambleText text="SELECTED.WORK" /></div>
      <div className="work-heading">
        <div><p className="eyebrow"><ScrambleText text="PROJECT INDEX / 2020—NOW" /></p><h2 id="work-title"><ScrambleText text="Built to solve." duration={1900} /><br /><em><ScrambleText text="Designed to last." duration={2000} delay={160} /></em></h2></div>
        <p>Selected independent and open-source work across product engineering, developer tooling, and useful automation.</p>
      </div>
      <div className="project-controls" aria-label="Filter projects">
        {categories.map((category) => (
          <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>
            {active === category && <motion.span layoutId="active-category" />}{category}
          </button>
        ))}
      </div>
      <div className="project-index" aria-live="polite">
        <div className="project-index-head"><span>PROJECT / SUMMARY</span><span>STACK</span><span>VIEW</span></div>
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((project, index) => (
            <motion.article key={project.name} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }} className="project-row">
              <div className="project-number">0{index + 1}</div>
              <div className="project-summary"><h3>{project.name}</h3><p>{project.description}</p></div>
              <div className="project-tech">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
              <button className="project-open" type="button" onClick={(event) => { openerRef.current = event.currentTarget; setSelected(project); }} aria-label={`View ${project.name} project details`}>↗</button>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="project-dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelected(null)}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" className="project-dialog" initial={{ opacity: 0, y: 25, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 25, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
              <button ref={closeButtonRef} className="dialog-close" onClick={() => setSelected(null)} type="button" aria-label="Close project details">[ × ]</button>
              <div className={`dialog-image${selected.name === "CodeBundle (Desktop)" ? " is-light-media" : ""}`}>
                <Image
                  src={selected.name === "CodeBundle (Desktop)" ? "/codebundle/primary_logo.png" : selected.image}
                  alt=""
                  fill
                  sizes="(max-width: 479px) calc(100vw - 2rem), (max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) 42vw, 480px"
                  className={
                    selected.name === "CodeBundle (Desktop)"
                      ? "object-contain p-8"
                      : containedPreviewProjects.has(selected.name)
                        ? "object-contain p-4"
                        : "object-cover"
                  }
                />
              </div>
              <div className="dialog-copy"><p className="eyebrow">PROJECT.DETAIL</p><h3 id="project-dialog-title">{selected.name}</h3><p>{selected.description}</p><div className="project-tech">{selected.tech.map((item) => <span key={item}>{item}</span>)}</div><div className="dialog-links"><a href={selected.github} target="_blank" rel="noreferrer">GitHub ↗</a>{selected.live && <a href={selected.live} target="_blank" rel="noreferrer">Live project ↗</a>}</div></div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      <SectionDivider side="right" />
    </section>
  );
}
