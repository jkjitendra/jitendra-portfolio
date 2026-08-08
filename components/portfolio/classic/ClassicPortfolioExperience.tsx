"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import EditionPreloader from "../EditionPreloader";
import Header from "@/components/Header";
import ClassicHomeClient from "./ClassicHomeClient";

export default function ClassicPortfolioExperience() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      setShowPreloader(false);
      setIsReady(true);
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(value + Math.random() * 11 + 5, 100);
        if (next === 100) window.clearInterval(interval);
        return next;
      });
    }, 120);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || progress < 100) return;
    const timeout = window.setTimeout(() => setShowPreloader(false), 300);
    return () => window.clearTimeout(timeout);
  }, [progress, reduceMotion]);

  return (
    <>
      <EditionPreloader show={showPreloader} progress={progress} onExitComplete={() => setIsReady(true)} />
      {isReady && <><Header forceClassic /><ClassicHomeClient /></>}
    </>
  );
}
