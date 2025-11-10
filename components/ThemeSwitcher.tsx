"use client";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // On first mount, sync with system or localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Switch theme"
      className={`transition-all rounded-full p-2 border border-white/10 bg-white/20 shadow active:scale-95`}
      style={{ outline: "none" }}
    >
      <span className="inline-block transition-transform duration-300 ease-in-out"
        style={{
          transform: "rotate(90deg)",
          transition: "transform 0.3s",
        }}
      >
        {theme === "light" ? (
          // Sun icon (light)
          <svg width={26} height={26} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" className="fill-yellow-400" />
            <g className="stroke-yellow-300" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </g>
          </svg>
        ) : (
          // Moon icon (dark)
          <svg width={26} height={26} viewBox="0 0 24 24" fill="currentColor">
            <path
              className="fill-yellow-300"
              d="M19.35 16.95A8 8 0 017.05 4.65 8 8 0 1019.35 16.95z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}