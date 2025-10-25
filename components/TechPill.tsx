"use client";

import { motion } from "framer-motion";
import VerticalPills from "./VerticalPills";

export default function TechPill() {
  return (
    <div className="relative">
      {/* Header section - Normal document flow */}
      <section className="container-edge pt-8 pb-8 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Tech Radar</h1>
          <p className="copy opacity-80 max-w-2xl">
            Explore my technology stack through these interactive 3D pill
            interfaces. Click the arrows to reveal and cycle through different
            technologies in each category.
          </p>
        </motion.div>
      </section>

      {/* Vertical Pills Component */}
      <VerticalPills />
    </div>
  );
}
