"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import SmartDownloadButton from "./SmartDownloadButton";

interface ProjectCardProps {
  project: {
    name: string;
    description: string;
    tech: string[];
    github?: string;
    live?: string;
    image?: string;
    demo?: {
      username?: string | null;
      password?: string | null;
    };
  };
  index: number;
  // Optional pre-fetched URLs for downloads (passed from server components)
  downloadUrls?: {
    windows?: string;
    mac?: string;
    linux?: string;
  };
}

export default function ProjectCard({ project, index, downloadUrls }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  // Mouse position relative to card center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for tilt
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized -0.5 to 0.5
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const p = project;
  const hasImage = p.image && !imageError;
  const isMazeSolver = p.name.includes("MazeSolver");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-card-3d"
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="card overflow-hidden h-full hover:border-[rgb(var(--accent))/0.3] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Project Image */}
        {hasImage && (
          <div className="relative w-full h-40 sm:h-48 overflow-hidden">
            <Image
              src={p.image!}
              alt={`${p.name} preview`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay for smooth blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg))] via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Fallback gradient for missing images */}
        {!hasImage && (
          <div
            className="relative w-full h-32 sm:h-40 overflow-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--accent), 0.2) 0%, rgba(var(--accentAlt), 0.1) 100%)`,
            }}
          >
            <div className="text-4xl opacity-30">💻</div>
          </div>
        )}

        {/* Card content */}
        <div className="relative p-5">
          {/* Shine overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.03) 45%,
                rgba(255, 255, 255, 0.06) 50%,
                rgba(255, 255, 255, 0.03) 55%,
                transparent 60%
              )`,
            }}
          />

          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-2 opacity-90 text-sm line-clamp-2">{p.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {p.tech.map((t: string) => (
              <span
                className="badge tech-badge-hover"
                key={t}
              >
                {t}
              </span>
            ))}
          </div>

          {p.demo?.username && (
            <div className="mt-3 text-xs opacity-80">
              Demo: <b>{p.demo?.username}</b> / <b>{p.demo?.password}</b>
            </div>
          )}

          <div className="mt-4 flex gap-3 text-sm">
            {p.github && (
              <a
                className="btn btn-sm btn-ghost interactive-btn cursor-pointer"
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: "auto" }}
              >
                GitHub
              </a>
            )}

            {/* Standard Live Button */}
            {p.live && !isMazeSolver && (
              <a
                className="btn interactive-btn cursor-pointer"
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: "auto" }}
              >
                Live
              </a>
            )}

            {/* Smart Download Button for MazeSolver */}
            {isMazeSolver && (
              <SmartDownloadButton
                // If caller passed specific URLs (like from server side), use them
                windowsUrl={downloadUrls?.windows}
                macUrl={downloadUrls?.mac}
                linuxUrl={downloadUrls?.linux}
                // Fallback to the 'live' link which is likely the releases page
                fallbackUrl={p.live || ""}
                className="btn interactive-btn cursor-pointer"
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
