"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = { variant?: "desktop" | "mobile-fab" };

const options = [
  { id: "emerald", label: "Emerald Noir" },
  { id: "light", label: "Light Mode" },
  { id: "amethyst", label: "Royal Amethyst" },
  { id: "sapphire", label: "Sapphire & Slate" },
  { id: "solar", label: "Solar Dawn" },
];

export default function ThemeSwitcher({ variant = "desktop" }: Props) {
  const [theme, setTheme] = useState("emerald");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "emerald";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // close menus on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const apply = (id: string) => {
    setTheme(id);
    setOpen(false);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme", id);
  };

  // live preview (desktop hover + pointer enter for touch)
  const preview = (id: string) =>
    document.documentElement.setAttribute("data-theme", id);

  const clearPreview = () =>
    document.documentElement.setAttribute("data-theme", theme);

  const MenuList = (
    <ul className="max-h-64 overflow-auto">
      {options.map((o) => {
        const active = o.id === theme;
        return (
          <li key={o.id}>
            <button
              onMouseEnter={() => preview(o.id)}
              onMouseLeave={clearPreview}
              onPointerEnter={() => preview(o.id)}
              onPointerLeave={clearPreview}
              onClick={() => apply(o.id)}
              className={`w-full text-left rounded-md px-3 py-2 text-base hover:bg-black/10 ${
                active ? "bg-black/10" : ""
              }`}
            >
              {o.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  // ===== Desktop inline switcher =====
  if (variant === "desktop") {
    const current = options.find((o) => o.id === theme)?.label ?? "Theme";
    return (
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-[14px] lg:text-[18px] xl:text-[20px] leading-none"
        >
          <span className="whitespace-nowrap">{current}</span>
          <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 z-[200] mt-2 w-56 rounded-lg border border-white/10 bg-black/70 backdrop-blur-md shadow-xl p-1">
            {MenuList}
          </div>
        )}
      </div>
    );
  }

  // ===== Mobile FAB via portal (fixed to viewport) =====
  if (!mounted) return null; // wait until client to use portal

  return createPortal(
    <div
      ref={wrapRef}
      className="
        md:hidden fixed z-[9999]
        right-[calc(16px+env(safe-area-inset-right,0))]
        bottom-[calc(16px+env(safe-area-inset-bottom,0))]
      "
    >
      {/* Circle button; toggles to X when open */}
      <button
        aria-label="Change theme"
        onClick={() => setOpen((o) => !o)}
        className="
          h-12 w-12 rounded-full
          bg-[rgb(var(--accent))] text-black
          shadow-[0_10px_25px_rgba(0,0,0,0.35)]
          border border-white/10
          flex items-center justify-center
          active:scale-95 transition
        "
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a9 9 0 0 0 0 18h2a3 3 0 0 0 3-3c0-1.1.9-2 2-2h1a2 2 0 0 0 0-4h-1a5 5 0 0 1-5-5 4 4 0 0 0-4-4zM8 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="
            absolute bottom-14 right-0 w-56
            rounded-lg border border-white/10 shadow-xl p-1
            bg-[rgb(var(--accent))] text-black
          "
        >
          {MenuList}
        </div>
      )}
    </div>,
    document.body
  );
}