"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import CompanyOrbit from "@/components/CompanyOrbit";
import InfiniteScroll from "./InfiniteScroll";
import Constellation from "./Constellation";
import MagneticGrid from "./MagneticGrid";
import RollingCylinder from "./RollingCylinder";
import SpotlightReveal from "./SpotlightReveal";
import ParallaxCards from "./ParallaxCards";
import HexPulseGrid from "./HexPulseGrid";

const VARIANTS = [
  { id: "orbit", name: "Original Orbit", component: CompanyOrbit },
  { id: "infinite", name: "Infinite Scroll", component: InfiniteScroll },
  { id: "constellation", name: "Constellation", component: Constellation },
  { id: "magnetic", name: "Magnetic Grid", component: MagneticGrid },
  { id: "cylinder", name: "Rolling Cylinder", component: RollingCylinder },
  { id: "spotlight", name: "Spotlight Reveal", component: SpotlightReveal },
  { id: "parallax", name: "Parallax Cards", component: ParallaxCards },
  { id: "hex", name: "Hex Pulse", component: HexPulseGrid },
] as const;

export default function ShowcaseSwitcher() {
  const [activeVariantId, setActiveVariantId] = useState<string>("infinite");

  const ActiveComponent = VARIANTS.find((v) => v.id === activeVariantId)?.component || InfiniteScroll;

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Companies I&apos;ve Worked With</h2>
          <p className="text-[rgb(var(--text))/0.6]">
            Previewing different design styles. Select a style below to view it.
          </p>
        </div>

        {/* Switcher UI */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {VARIANTS.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setActiveVariantId(variant.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                border
                ${activeVariantId === variant.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-800/50 text-gray-300 border-gray-700 hover:border-blue-400 hover:text-white"
                }
              `}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>

      {/* Component Render Area */}
      <div className="w-full min-h-[400px] flex items-center justify-center bg-[rgb(var(--bg))/0.5] border-y border-[rgb(var(--text))/0.05] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariantId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* 
                  Note: Passing dummy props or ensuring components handle their own data.
                  For now, we assume components fetch their own data like CompanyOrbit does.
                */}
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
