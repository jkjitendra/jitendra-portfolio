"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import techRadarData from "@/data/tech-radar.json";

interface PillCategory {
  name: string;
  color: string;
  borderColor: string;
  items: string[];
}

const PILL_CATEGORIES: PillCategory[] = [
  {
    name: "Frameworks",
    color: "linear-gradient(to bottom, #4ade80, #16a34a)", // Green gradient
    borderColor: "border-green-400/50",
    items: techRadarData["Frameworks"]
  },
  {
    name: "Databases", 
    color: "linear-gradient(to bottom, #facc15, #ca8a04)", // Yellow gradient
    borderColor: "border-yellow-400/50",
    items: techRadarData["Databases"]
  },
  {
    name: "Tools",
    color: "linear-gradient(to bottom, #3b82f6, #1d4ed8)", // Blue gradient
    borderColor: "border-blue-500/50",
    items: techRadarData["Tools"]
  },
  {
    name: "Others",
    color: "linear-gradient(to bottom, #f472b6, #db2777)", // Pink gradient
    borderColor: "border-pink-400/50", 
    items: techRadarData["Others"]
  }
];

// Custom hook for responsive detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, mounted };
}


const pillVariants: Variants = {
  hidden: { 
    y: 120, 
    opacity: 0, 
    scale: 0.7,
    rotate: 20,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }),
  exit: {
    y: -60,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.3 // Content starts appearing after arrow animation completes
    }
  }
};

const arrowMoveVariants: Variants = {
  initial: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    x: '-50%',
  },
  moveUp: { 
    y: -420, 
    opacity: 0,
    scale: 0.8,
    x: '-50%',
    transition: {
      duration: 0.8, // Slower animation
      ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth movement
      opacity: { delay: 0.8, duration: 0.4 }, // Opacity fades later
      scale: { delay: 0.6, duration: 0.6 } // Scale changes later
    }
  }
};

// Mobile-specific arrow variants with shorter distance
const mobileArrowMoveVariants: Variants = {
  initial: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    x: '-50%',
  },
  moveUp: { 
    y: -280, // Shorter distance for mobile
    opacity: 0,
    scale: 0.8,
    x: '-50%',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      opacity: { delay: 0.8, duration: 0.4 },
      scale: { delay: 0.6, duration: 0.6 }
    }
  }
};

interface SinglePillProps {
  category: PillCategory;
  index: number;
}

function SinglePill({ category, index }: SinglePillProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const { isMobile, mounted } = useIsMobile();

  const handleArrowClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (!isExpanded) {
      // First click - animate arrow up slowly, then show content
      setShowArrow(false);

      // Wait for arrow animation to complete before showing content
      setTimeout(() => {
        setIsExpanded(true);
      }, 800); // Match arrow animation duration
      
      // Reset animation state after everything completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200); // After content animation completes
    } else {
      // Subsequent clicks - cycle through content
      setCurrentIndex((prev) => (prev + 1) % category.items.length);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  // Use mounted check to prevent hydration mismatch
  const maxVisibleItems = mounted && isMobile ? 3 : 6;
  const visibleItems = [];
  
  if (isExpanded) {
    for (let i = 0; i < Math.min(maxVisibleItems, category.items.length); i++) {
      const itemIndex = (currentIndex + i) % category.items.length;
      visibleItems.push({
        item: category.items[itemIndex],
        key: `${itemIndex}-${currentIndex}`,
        index: i
      });
    }
  }

  // Prevent hydration mismatch by returning consistent markup until mounted
  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center">
        {/* Label */}
        <div className="mt-6 mb-4 text-center max-w-32 pl-20">
          <p className="text-sm font-medium text-white/90 leading-tight">
            {category.name}
          </p>
          <div className="w-16 h-px bg-white/20 mx-auto mb-3" />
        </div>

        {/* Default pill container */}
        <div
          className={clsx(
            "relative w-28 h-[500px] transform rotate-12", 
            "rounded-[100px] border border-white/20 shadow-2xl overflow-hidden",
            category.borderColor
          )}
          style={{
            background: category.color,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-6 flex flex-col items-center justify-start pt-4 gap-3">
              {/* Empty content track */}
            </div>
          </div>

          {/* Default arrow button */}
          <button
            className="absolute bottom-4 left-1/2 w-20 h-20 rounded-full 
                       bg-black/90 border border-white/20 flex items-center justify-center
                       text-white shadow-lg z-10"
            style={{ transform: 'translateX(-50%)' }}
            onClick={handleArrowClick}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="M6 11l6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Label */}
      <div className="mt-3 mb-2 md:mt-6 md:mb-4 text-center max-w-32 md:pl-20">
        <p className="text-xs md:text-sm font-medium text-white/90 leading-tight">
          {category.name}
        </p>
        <div className="w-12 md:w-16 h-px bg-white/20 mx-auto mb-2 md:mb-3" />
      </div>

      {/* Pill Container - Right tilted */}
      <div
        className={clsx(
          "relative transform rotate-12",
          "w-20 h-[300px] md:w-28 md:h-[500px]",
          "rounded-[60px] md:rounded-[100px] border border-white/20 shadow-2xl overflow-hidden",
          category.borderColor
        )}
        style={{
          background: category.color,
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Content Track */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-3 md:inset-6 flex flex-col items-center justify-start pt-2 gap-2 md:pt-4 md:gap-3">
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  className="flex flex-col gap-2 md:gap-3 items-center"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {visibleItems.map(({ item, key, index: itemIndex }) => (
                    <motion.div
                      key={key}
                      className="rounded-full bg-black/90 border border-white/10 
                                 flex items-center justify-center text-white font-medium
                                 shadow-lg
                                 w-16 h-16 md:w-20 md:h-20"
                      variants={pillVariants}
                      custom={itemIndex}
                      layout
                    >
                      <span className="text-center leading-tight text-[10px] md:text-[12px] px-1">
                        {item.length > 12 ? item.slice(0, 10) + '..' : item}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Arrow Button - Bottom center with animation */}
        <AnimatePresence>
          {showArrow && (
            <motion.button
              className="absolute bottom-2 md:bottom-4 left-1/2 
                        w-16 h-16 md:w-20 md:h-20 rounded-full 
                        bg-black/90 border border-white/20 
                        flex items-center justify-center
                        text-white shadow-lg z-10"
              onClick={handleArrowClick}
              disabled={isAnimating}
              whileHover={{ scale: 1.05, x: '-50%' }}
              whileTap={{ scale: 0.95, x: '-50%' }}
              variants={isMobile ? mobileArrowMoveVariants : arrowMoveVariants}
              initial="initial"
              animate={!showArrow ? "moveUp" : "initial"}
              exit="moveUp"
            >
              <svg
                width="16"
                height="16"
                className="md:w-[18px] md:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="M6 11l6-6 6 6" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function VerticalPills() {
  const { mounted } = useIsMobile();

  return (
    <div className="relative w-full py-8 md:py-16">
      {/* Pills container - Responsive grid layout */}
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Mobile: 2x2 grid, Tablet+: single row */}
        <div className={clsx(
          "place-items-center",
          mounted ? "grid grid-cols-2 gap-6 md:flex md:gap-8 lg:gap-20 md:items-center md:justify-center" 
                  : "flex gap-8 lg:gap-20 items-center justify-center"
        )}>
          {PILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className="w-full flex justify-center"
            >
              <SinglePill 
                category={category} 
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-3/4 h-3/4 bg-gradient-radial from-white/3 to-transparent 
                        rounded-full blur-3xl" />
      </div>
    </div>
  );
}
