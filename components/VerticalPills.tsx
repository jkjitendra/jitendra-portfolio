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


const getTechDisplayName = (techName: string): string => {
  // Special cases for better display names
  const displayNames: Record<string, string> = {
    'apachekafka': 'Apache Kafka',
    'awscodeartifact': 'AWS CodeArtifact',
    'awslambda': 'AWS Lambda',
    'awss3': 'AWS S3',
    'bitbucket': 'Bitbucket',
    'cassandra': 'Apache Cassandra',
    'circleci': 'CircleCI',
    'confluence': 'Confluence',
    'consul': 'HashiCorp Consul',
    'docker': 'Docker',
    'elasticsearch': 'Elastic Search',
    'express': 'Express.js',
    'git': 'Git',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'go': 'Go',
    'gradle': 'Gradle',
    'grafana': 'Grafana',
    'hibernate': 'Hibernate',
    'intellij': 'IntelliJ IDEA',
    'java': 'Java',
    'javascript': 'JavaScript',
    'jenkins': 'Jenkins',
    'jfrog': 'JFrog Artifactory',
    'jira': 'Jira',
    'json': 'JSON',
    'junit': 'JUnit',
    'jwt': 'JWT',
    'kalilinux': 'Kali Linux',
    'kibana': 'Kibana',
    'kubernetes': 'Kubernetes',
    'linux': 'Linux',
    'mariadb': 'MariaDB',
    'maven': 'Maven',
    'mongodb': 'MongoDB',
    'mysql': 'MySQL',
    'nextjs': 'Next.js',
    'nexus': 'Nexus',
    'nodejs': 'Node.js',
    'nomad': 'HashiCorp Nomad',
    'notion': 'Notion',
    'npm': 'npm',
    'oauth': 'OAuth',
    'openapi': 'OpenAPI',
    'opencv': 'OpenCV',
    'oracle': 'Oracle DB',
    'pcf': 'Pivotal Cloud Foundry',
    'postgresql': 'PostgreSQL',
    'postman': 'Postman',
    'protobuf': 'Protobuf',
    'python': 'Python',
    'raspberrypi': 'Raspberry Pi',
    'react': 'React',
    'redis': 'Redis',
    'redux': 'Redux',
    'restapi': 'REST API',
    'scala': 'Scala',
    'sonarqube': 'SonarQube',
    'spring': 'Spring',
    'springboot': 'Spring Boot',
    'ssh': 'SSH',
    'swagger': 'Swagger',
    'tailwindcss': 'Tailwind CSS',
    'typescript': 'TypeScript',
    'ubuntu': 'Ubuntu',
    'vite': 'Vite',
    'visualstudiocode': 'VS Code'  
  };

  const key = techName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return displayNames[key] || techName;
};

const getCircleBackgroundColor = (categoryName: string): string => {
  const colorMap: Record<string, string> = {
    'Frameworks': 'rgba(127, 255, 212, 0.8)', // aquamarine with transparency
    'Databases': 'rgba(240, 230, 140, 0.8)',  // khaki with transparency
    'Tools': 'rgba(147, 112, 219, 0.8)',      // mediumpurple with transparency
    'Others': 'rgba(221, 160, 221, 0.8)'      // plum with transparency
  };
  
  return colorMap[categoryName] || 'burlywood';
};

function useResponsiveTiming() {
  const [timing, setTiming] = useState({
    rollingDelay: 0.3,
    carouselStartDelay: 100,
    arrowDuration: 0.8
  });

  useEffect(() => {
    const updateTiming = () => {
      const width = window.innerWidth;
      
      if (width >= 1024) {
        // Large screens - slower rolling, faster arrow
        setTiming({
          rollingDelay: 0.5, // Increased delay for rolling animation
          carouselStartDelay: 300, // More delay before carousel starts
          arrowDuration: 0.6 // Faster arrow animation
        });
      } else if (width >= 768) {
        // Medium screens
        setTiming({
          rollingDelay: 0.4,
          carouselStartDelay: 200,
          arrowDuration: 0.7
        });
      } else {
        // Small screens - current timing works fine
        setTiming({
          rollingDelay: 0.3,
          carouselStartDelay: 100,
          arrowDuration: 0.8
        });
      }
    };

    updateTiming();
    window.addEventListener('resize', updateTiming);
    return () => window.removeEventListener('resize', updateTiming);
  }, []);

  return timing;
}

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


interface TechIconProps {
  techName: string;
  size: string;
  className?: string;
}

function TechIcon({ techName, size, className = "" }: TechIconProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // const imageSrc = getImageSrc(techName);
  const [currentSrc, setCurrentSrc] = useState('');
  const displayName = getTechDisplayName(techName);

  const fileName = techName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\./g, '')
    .replace(/\s+/g, '');
  
  // Technology URL mapping for all your technologies
  const techUrlMap: Record<string, string> = {
    'java': 'https://www.java.com/',
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'typescript': 'https://www.typescriptlang.org/',
    'python': 'https://www.python.org/',
    'go': 'https://golang.org/',
    'scala': 'https://www.scala-lang.org/',
    'r': 'https://www.r-project.org/',
    'spring': 'https://spring.io/',
    'springboot': 'https://spring.io/projects/spring-boot',
    'hibernate': 'https://hibernate.org/',
    'junit': 'https://junit.org/',
    'maven': 'https://maven.apache.org/',
    'gradle': 'https://gradle.org/',
    'nodejs': 'https://nodejs.org/',
    'express': 'https://expressjs.com/',
    'react': 'https://reactjs.org/',
    'redux': 'https://redux.js.org/',
    'nextjs': 'https://nextjs.org/',
    'tailwindcss': 'https://tailwindcss.com/',
    'vite': 'https://vitejs.dev/',
    'npm': 'https://www.npmjs.com/',
    'raspberrypi': 'https://www.raspberrypi.org/',
    'mysql': 'https://www.mysql.com/',
    'mariadb': 'https://mariadb.org/',
    'postgresql': 'https://www.postgresql.org/',
    'oracle': 'https://www.oracle.com/database/',
    'mongodb': 'https://www.mongodb.com/',
    'cassandra': 'https://cassandra.apache.org/',
    'redis': 'https://redis.io/',
    'elasticsearch': 'https://www.elastic.co/',
    'apachekafka': 'https://kafka.apache.org/',
    'kibana': 'https://www.elastic.co/kibana',
    'git': 'https://git-scm.com/',
    'github': 'https://github.com/',
    'gitlab': 'https://gitlab.com/',
    'bitbucket': 'https://bitbucket.org/',
    'jira': 'https://www.atlassian.com/software/jira',
    'confluence': 'https://www.atlassian.com/software/confluence',
    'jenkins': 'https://www.jenkins.io/',
    'docker': 'https://www.docker.com/',
    'kubernetes': 'https://kubernetes.io/',
    'circleci': 'https://circleci.com/',
    'consul': 'https://www.consul.io/',
    'nomad': 'https://www.nomadproject.io/',
    'postman': 'https://www.postman.com/',
    'swagger': 'https://swagger.io/',
    'pcf': 'https://pivotal.io/',
    'nexus': 'https://www.sonatype.com/nexus-repository-sonatype',
    'jfrog': 'https://jfrog.com/',
    'sonarqube': 'https://www.sonarqube.org/',
    'grafana': 'https://grafana.com/',
    'intellij': 'https://www.jetbrains.com/idea/',
    'visualstudiocode': 'https://code.visualstudio.com/',
    'awss3': 'https://aws.amazon.com/s3/',
    'awslambda': 'https://aws.amazon.com/lambda/',
    'awscodeartifact': 'https://aws.amazon.com/codeartifact/',
    'oauth': 'https://oauth.net/',
    'openapi': 'https://www.openapis.org/',
    'opencv': 'https://opencv.org/',
    'graphql': 'https://graphql.org/',
    'restapi': 'https://restfulapi.net/',
    'jwt': 'https://jwt.io/',
    'json': 'https://www.json.org/',
    'protobuf': 'https://developers.google.com/protocol-buffers',
    'ssh': 'https://www.ssh.com/',
    'kalilinux': 'https://www.kali.org/',
    'linux': 'https://www.linux.org/',
    'ubuntu': 'https://ubuntu.com/',
    'notion': 'https://www.notion.so/'
  };

  const websiteUrl = techUrlMap[fileName];

  // Image sources to try in order (SVG first, then PNG)
  const imageSources = [
    `/tech/${fileName}-original.svg`,
    `/tech/${fileName}.svg`,
    `/tech/${fileName}.png`,
    `/tech/${fileName}-original.png`
  ];
  
  useEffect(() => {
    setCurrentSrc(imageSources[0]); // Start with first option
  }, [techName]);

  const handleImageError = () => {
    const currentIndex = imageSources.indexOf(currentSrc);
    if (currentIndex < imageSources.length - 1) {
      setCurrentSrc(imageSources[currentIndex + 1]);
    } else {
      setImageError(true);
    }
  };

  const handleClick = () => {
    if (websiteUrl) {
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (imageError) {
    // Fallback to text if image fails to load
    return (
      <div 
        className={`relative ${className} cursor-pointer`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <span className="text-center leading-tight text-[10px] md:text-[12px] px-1 text-white">
          {techName.length > 12 ? techName.slice(0, 10) + '..' : techName}
        </span>
        
        {/* Enhanced Tooltip with click instruction */}
        {showTooltip && (
          <div className=" hidden md:block fixed left-1/2 transform -translate-x-1/2 mb-2 
                         px-4 py-3 bg-black/90 text-white text-sm font-medium rounded-lg
                         whitespace-nowrap z-[9999] pointer-events-none shadow-lg border border-white/20">
            {displayName}
          </div>
        )}
      </div>
    );
  }

  // Don't render img if currentSrc is empty
  if (!currentSrc) {
    return (
      <div className={`${size} ${className} bg-gray-300 rounded animate-pulse`}>
        {/* Loading placeholder */}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className} ${websiteUrl ? 'cursor-pointer' : 'cursor-default'}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
    >
      <img
        src={currentSrc}
        alt={displayName}
        className={`${size}  transition-all duration-200 
                   ${showTooltip ? 'opacity-80 scale-105' : 'opacity-100'}`}
        onError={handleImageError}
        loading="lazy"
        draggable={false}
        // Hint browsers that these are low-priority visuals
        fetchPriority="low"
      />
      
      {/* Enhanced Tooltip with click instruction */}
      {showTooltip && (
        <div className=" hidden md:block fixed top-[5%] left-1/2 transform -translate-x-1/2 mb-2 
                       px-2 py-2 bg-black/90 text-white text-wrap text-xs font-small rounded-lg
                       whitespace-nowrap z-[9999] pointer-events-none shadow-2xl border border-white/20">
          {displayName}
        </div>
      )}
    </div>
  );
}

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
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isMobile, mounted } = useIsMobile();
  const timing = useResponsiveTiming();

  // Create extended items array for seamless looping (like company carousel):-
  //  Triple the items for seamless loop
  const extendedItems = [
    ...category.items,
    ...category.items,
    ...category.items,
  ];

  // Smooth sliding carousel (like company carousel)
  useEffect(() => {
    if (isCarouselPlaying && isExpanded && animationMode === 'carousel' && !isPaused) {
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
  }, [isCarouselPlaying, isExpanded, animationMode, isPaused, category.items.length, isMobile, mounted]);

  // Handle pill hover
  const handlePillMouseEnter = () => {
    setIsHovered(true);
    setIsPaused(true);
  };

  const handlePillMouseLeave = () => {
    setIsHovered(false);
    setIsPaused(false);
  };

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

    // Updated container variants with responsive timing
  const responsiveContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: timing.rollingDelay // Use responsive delay
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

  // Updated arrow variants with responsive timing
  const responsiveArrowMoveVariants: Variants = {
    initial: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      x: '-50%',
    },
    moveUp: { 
      y: isMobile ? -280 : -420,
      opacity: 0,
      scale: 0.8,
      x: '-50%',
      transition: {
        duration: timing.arrowDuration, // Use responsive duration
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { delay: timing.arrowDuration * 0.7, duration: 0.4 },
        scale: { delay: timing.arrowDuration * 0.6, duration: 0.4 }
      }
    }
  };


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
        onMouseEnter={handlePillMouseEnter}
        onMouseLeave={handlePillMouseLeave}
      >
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
                      variants={responsiveContainerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onAnimationComplete={() => {
                        // Start carousel after rolling animation completes
                        setTimeout(() => {
                          setAnimationMode('carousel');
                          setIsCarouselPlaying(true);
                        }, timing.carouselStartDelay); // Responsive delay
                      }}
                    >
                      {visibleItems.map(({ item, key, index: itemIndex }) => (
                        <motion.div
                          key={key}
                          className="w-[3.5rem] h-[3.5rem] md:w-20 md:h-20
                                    rounded-full border border-white/10 
                                    flex items-center justify-center text-black font-medium
                                    shadow-lg backdrop-blur-sm pill-rolling-item flex-shrink-0"
                          variants={pillVariants}
                          custom={itemIndex}
                          layout
                          style={{ 
                            transformStyle: 'preserve-3d',
                            transformOrigin: 'center center',
                            backgroundColor: getCircleBackgroundColor(category.name) // Dynamic background color
                          }}
                        >
                          <TechIcon 
                            techName={item}
                            size="w-6 h-6 md:w-8 md:h-8"
                            className="flex items-center justify-center"
                          />
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
                      transition: isPaused ? 'none' : 'transform 0.8s linear', // Disable transition when paused
                      gap: isMobile && mounted ? '16px' : '12px'
                    }}
                  >
                    {extendedItems.map((item, idx) => (
                      <div
                        key={`${item}-${idx}`}
                        className="w-[3.5rem] h-[3.5rem] md:w-20 md:h-20
                                  rounded-full border border-white/10 
                                  flex items-center justify-center text-black font-medium
                                  shadow-lg pill-rolling-item flex-shrink-0"
                        style={{
                          backgroundColor: getCircleBackgroundColor(category.name) // Dynamic background color
                        }}
                      >
                        <TechIcon 
                          techName={item}
                          size="w-6 h-6 md:w-8 md:h-8"
                          className="flex items-center justify-center"
                        />
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
              variants={responsiveArrowMoveVariants}
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
