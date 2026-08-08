"use client";

import { AnimatePresence, motion } from "framer-motion";

type EditionPreloaderProps = {
  show: boolean;
  progress: number;
  onExitComplete?: () => void;
};

export default function EditionPreloader({ show, progress, onExitComplete }: EditionPreloaderProps) {
  const progressDisplay = Math.round(Math.min(progress, 100));

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
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
  );
}
