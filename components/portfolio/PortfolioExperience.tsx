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

const preloadedImages = [
  "/logos/image.jpg",
  "/projects/xpense.png",
  "/projects/edukitbox.png",
  "/projects/blog_app.png",
  "/codebundle/primary_logo.png",
  "/projects/price_peek.jpg",
  "/projects/error_sound_alert.svg",
];

export default function PortfolioExperience() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isExperienceReady, setIsExperienceReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const progressDisplay = Math.round(Math.min(progress, 100));

  useEffect(() => {
    if (reduceMotion) {
      setShowPreloader(false);
      return;
    }

    let active = true;
    let completed = 0;
    const markComplete = () => {
      if (!active) return;
      completed += 1;
      if (completed === preloadedImages.length) setImagesReady(true);
    };

    preloadedImages.forEach((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.onload = markComplete;
      image.onerror = markComplete;
      image.src = src;
    });

    return () => {
      active = false;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + Math.random() * 9 + 2, 100);
        if (next === 100 && !cancelled) window.clearInterval(interval);
        return next;
      });
    }, 140);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setShowPreloader(false);
      setIsExperienceReady(true);
      return;
    }
    if (progress < 100 || !imagesReady) return;
    const timeout = window.setTimeout(() => setShowPreloader(false), 450);
    return () => window.clearTimeout(timeout);
  }, [imagesReady, progress, reduceMotion]);

  return (
    <main className="portfolio-site">
      <AnimatePresence onExitComplete={() => setIsExperienceReady(true)}>
        {showPreloader && (
          <motion.div className="portfolio-preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} aria-hidden="true">
            <span>[ INITIALISING PORTFOLIO ]</span>
            <div className="portfolio-preloader-progress">
              <div className="portfolio-preloader-progress-shell">
                <div className="portfolio-preloader-track">
                  <span className="portfolio-preloader-fill" style={{ width: `${progressDisplay}%` }} />
                </div>
                <span className="portfolio-preloader-plane" style={{ left: `calc(${progressDisplay}% - 1.5rem)` }}>✈︎</span>
                <b>{progressDisplay}%</b>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isExperienceReady && <>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SectionNav />
        <div id="main-content">
          <IntroSection />
          <AboutSection />
          <ExperienceTimeline />
          <ProjectIndex />
          <StackSection />
          <ContactTerminal />
        </div>
      </>}
    </main>
  );
}
