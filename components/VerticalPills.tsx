"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
    color: "#8ddd8d",
    borderColor: "border-green-400/50",
    items: techRadarData["Frameworks"]
  },
  {
    name: "Databases", 
    color: "#e0e055", // Yellow gradient
    borderColor: "border-yellow-400/50",
    items: techRadarData["Databases"]
  },
  {
    name: "Tools",
    color: "#6066ee", // Blue gradient
    borderColor: "border-blue-500/50",
    items: techRadarData["Tools"]
  },
  {
    name: "Others",
    color: "#faaafa", // Pink gradient
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

// Enhanced rolling animations - continuous rolling while moving up
const pillVariants: Variants = {
  hidden: { 
    y: 150, 
    opacity: 0, 
    scale: 0.6,
    rotate: 540, // Multiple rotations for continuous rolling effect
    transformOrigin: "center center"
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0, 
    transformOrigin: "center center",
    transition: {
      delay: i * 0.06,
      duration: 0.7, // Longer duration for smooth rolling
      ease: [0.25, 0.1, 0.25, 1],
      // Different easing for rotation to create rolling effect
      rotate: {
        duration: 0.7,
        ease: "linear", // Linear rotation for consistent rolling
      },
      // Y movement with easing
      y: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      },
      // Scale and opacity with different timing
      scale: {
        duration: 0.5,
        ease: "easeOut"
      },
      opacity: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  }),
  exit: {
    y: -150,
    opacity: 0,
    scale: 0.6,
    rotate: -540, // Counter-clockwise exit rolling
    transformOrigin: "center center",
    transition: {
      duration: 0.7,
      ease: [0.55, 0.06, 0.55, 0.94],
      rotate: {
        duration: 0.7,
        ease: "linear"
      }
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.3
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
  const [animationMode, setAnimationMode] = useState<'rolling' | 'carousel'>('rolling');
  
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isMobile, mounted } = useIsMobile();

  // Create extended items array for seamless looping (like company carousel):-
  //  Triple the items for seamless loop
  const extendedItems = [
    ...category.items,
    ...category.items,
    ...category.items,
  ];

  // Smooth sliding carousel (like company carousel)
  useEffect(() => {
    if (isCarouselPlaying && isExpanded && animationMode === 'carousel') {
      intervalRef.current = setInterval(() => {
        setTranslateY(prev => {
          const itemHeight = isMobile && mounted ? 72 : 92; // Height of each item + gap
          const newY = prev - itemHeight;
          
          // Reset position when we've scrolled through original items
          if (Math.abs(newY) >= itemHeight * category.items.length) {
            return 0;
          }
          
          return newY;
        });
      }, 1500); // Slower, more readable speed like company carousel
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCarouselPlaying, isExpanded, animationMode, category.items.length, isMobile, mounted]);

  const handleArrowClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (!isExpanded) {
      // First click - start carousel
      setShowArrow(false); // Hide arrow immediately
      setIsExpanded(true);
      // setIsCarouselPlaying(true); // Start carousel
      setAnimationMode('rolling'); // Start with rolling mode
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  // Use mounted check to prevent hydration mismatch
  const maxVisibleItems = mounted && isMobile ? 3 : 5;
  const visibleItems = [];
  
  if (isExpanded) {
    for (let i = 0; i < Math.min(maxVisibleItems, category.items.length); i++) {
      const itemIndex = (currentIndex + i) % category.items.length;
      visibleItems.push({
        item: category.items[itemIndex],
        key: `${itemIndex}-${currentIndex}-${animationKey}`, // Include animation key for unique keys
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
            "relative w-28 h-[500px]", 
            "rounded-[100px] shadow-2xl overflow-hidden",
            category.borderColor
          )}
          style={{
            transform: 'rotate(18deg)',
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
      <div className="hidden md:block mt-3 mb-2 md:mt-6 md:mb-4 text-center max-w-32 md:pl-20">
        <p className="text-xs md:text-sm font-medium text-white/90 leading-tight">
          {category.name}
        </p>
        <div className="w-12 md:w-16 h-px bg-white/20 mx-auto mb-2 md:mb-3" />
      </div>

      {/* Pill Container - Right tilted */}
      <div
        className={clsx(
          "relative",
          "w-20 h-[220px] md:w-32 md:h-[500px]",
          "rounded-[60px] md:rounded-[3.47rem] overflow-hidden",
          category.borderColor
        )}
        style={{
          transform: mounted && isMobile ? 'rotate(10deg)' : 'rotate(18deg)',
          background: category.color,
          backdropFilter: 'blur(20px)',
          outlineWidth: '3px',
          outlineStyle: 'solid',
          outline: 'dotted',
          boxShadow: 'inset 2px 4px 8px #00000080'
        }}
      >
        {/* Content Track */}
        {/* Content Track - Sliding Container */}
        {/* Content Track - Sliding Container with Rolling Entrance */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-3 md:inset-6 flex items-start justify-center">
            {isExpanded && (
              <div 
                className="w-full overflow-hidden relative"
                style={{ height: mounted && isMobile ? '210px' : '450px' }}
              >
                {/* Initial rolling animation phase */}
                {!isCarouselPlaying && (
                  <AnimatePresence mode="popLayout" key={animationKey}>
                    <motion.div
                      className="flex flex-col gap-4 md:gap-3 items-center absolute top-0 left-0 right-0"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onAnimationComplete={() => {
                        // Start carousel after rolling animation completes
                        setTimeout(() => {
                          setAnimationMode('carousel');
                          setIsCarouselPlaying(true);
                        }, 100);
                      }}
                    >
                      {visibleItems.map(({ item, key, index: itemIndex }) => (
                        <motion.div
                          key={key}
                          className="w-[3.5rem] h-[3.5rem] md:w-20 md:h-20
                                    rounded-full bg-black/90 border border-white/10 
                                    flex items-center justify-center text-white font-medium
                                    shadow-lg backdrop-blur-sm pill-rolling-item flex-shrink-0"
                          variants={pillVariants}
                          custom={itemIndex}
                          layout
                          style={{ 
                            transformStyle: 'preserve-3d',
                            transformOrigin: 'center center'
                          }}
                        >
                          <span 
                            className="text-center leading-tight text-[10px] md:text-[12px] px-1"
                            style={{ 
                              transform: mounted && isMobile ? 'rotateZ(0deg)' : 'rotateZ(0deg)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.length > 12 ? item.slice(0, 10) + '..' : item}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Sliding carousel phase */}
                {isCarouselPlaying && (
                  <motion.div
                    className="flex flex-col items-center absolute top-0 left-0 right-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      transform: `translateY(${translateY}px)`,
                      transition: 'transform 0.8s linear',
                      gap: isMobile && mounted ? '16px' : '12px' // Consistent gap
                    }}
                  >
                    {extendedItems.map((item, idx) => (
                      <div
                        key={`${item}-${idx}`}
                        className="w-[3.5rem] h-[3.5rem] md:w-20 md:h-20
                                  rounded-full bg-black/90 border border-white/10 
                                  flex items-center justify-center text-white font-medium
                                  shadow-lg pill-rolling-item flex-shrink-0"
                      >
                        <span 
                          className="text-center leading-tight text-[10px] md:text-[12px] px-1"
                          style={{ 
                            transform: mounted && isMobile ? 'rotateZ(0deg)' : 'rotateZ(0deg)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.length > 12 ? item.slice(0, 10) + '..' : item}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Arrow Button - Only show when carousel is not playing */}
        <AnimatePresence>
          {showArrow && !isCarouselPlaying && (
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
    <div className="relative w-full py-4 md:py-16">
      {/* Pills container - Responsive grid layout */}
      <div className="w-full md:w-[46%] max-w-7xl mx-auto px-4">
        {/* Mobile: 2x2 grid, Tablet+: single row */}
        <div className={clsx(
          "place-items-center",
          mounted ? "grid grid-cols-4 gap-1 md:flex md:gap-8 lg:gap-20 md:items-center md:justify-center" 
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
