"use client";

import { useEffect, useState, useCallback } from "react";

export default function MouseGradient() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Throttle updates for performance
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
    });
  }, []);

  useEffect(() => {
    // Fade in after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        background: `
          radial-gradient(
            600px circle at ${position.x}% ${position.y}%,
            rgba(var(--accent), 0.08),
            transparent 40%
          )
        `,
        willChange: "background",
      }}
      aria-hidden="true"
    />
  );
}
