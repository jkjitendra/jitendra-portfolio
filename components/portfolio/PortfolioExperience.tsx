"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionNav from "./SectionNav";
import IntroSection from "./IntroSection";
import AboutSection from "./AboutSection";
import ExperienceTimeline from "./ExperienceTimeline";
import ProjectIndex from "./ProjectIndex";
import StackSection from "./StackSection";
import ContactTerminal from "./ContactTerminal";

export default function PortfolioExperience() {
  const [showPreloader, setShowPreloader] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) { setShowPreloader(false); return; }
    const timeout = window.setTimeout(() => setShowPreloader(false), 1050);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <main className="portfolio-site">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <AnimatePresence>{showPreloader && <motion.div className="portfolio-preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} aria-hidden="true"><span>[ INITIALISING PORTFOLIO ]</span><b>100%</b></motion.div>}</AnimatePresence>
      <SectionNav />
      <div id="main-content">
        <IntroSection />
        <AboutSection />
        <ExperienceTimeline />
        <ProjectIndex />
        <StackSection />
        <ContactTerminal />
      </div>
    </main>
  );
}
