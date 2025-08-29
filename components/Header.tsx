"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open || !panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 transition ${scrolled ? "backdrop-blur bg-black/40" : ""}`}>
      <div className="mx-auto max-w-6xl flex items-center gap-3 py-3">
        {/* LEFT: Logo */}
        <Link href="/" aria-label="Home" className="relative z-10 shrink-0 ml-[-1rem] sm:ml-[-1.5rem] lg:ml-[-2rem]">
          <div className="relative h-8 sm:h-9 md:h-10 w-[120px] sm:w-[140px] md:w-[160px]">
            <Image
              src="/logos/jk_logo.png"
              alt="Jitendra Logo"
              fill
              priority
              sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
              className="object-contain [filter:drop-shadow(0_0_10px_rgba(0,0,0,0.35))]"
            />
          </div>
        </Link>

        {/* MIDDLE: Nav pushed to the right */}
        <nav className="hidden md:flex ml-auto items-center gap-6 lg:gap-8 text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-6">
          <Link href="/projects" className="hover:text-[rgb(var(--accentAlt))]">Projects</Link>
          <Link href="/tech-radar" className="hover:text-[rgb(var(--accentAlt))]">Tech Radar</Link>
          <Link href="/resume" className="hover:text-[rgb(var(--accentAlt))]">Resume</Link>
          <Link href="/testimonials" className="hover:text-[rgb(var(--accentAlt))]">Testimonials</Link>
          <Link href="/blogs" className="hover:text-[rgb(var(--accentAlt))]">Blogs</Link>
        </nav>

        {/* RIGHT: Theme switcher on desktop */}
        <div className="hidden md:block md:ml-4 md:mr-2 lg:mr-4 ml-auto">
          <ThemeSwitcher variant="desktop" />
        </div>

        {/* Hamburger (mobile) — stays at the far right on small screens */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="md:hidden ml-[220px] inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile slide-over */}
      <div className={`md:hidden fixed inset-0 z-[999] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} style={{ backgroundColor: "rgba(var(--bg),0.5)" }} />
        <div
          ref={panelRef}
          className={`absolute right-0 top-0 h-full w-72 max-w-[85%] border-l border-white/10 backdrop-blur-xl shadow-xl transition-transform duration-300 theme-panel ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog" aria-modal="true"
        >
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <Link onClick={() => setOpen(false)} href="/" className="rounded-md px-3 py-2 hover:bg-white/10">Home</Link>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4 text-base">
            <Link onClick={() => setOpen(false)} href="/projects" className="rounded-md px-3 py-2 hover:bg-white/10">Projects</Link>
            <Link onClick={() => setOpen(false)} href="/tech-radar" className="rounded-md px-3 py-2 hover:bg-white/10">Tech Radar</Link>
            <Link onClick={() => setOpen(false)} href="/resume" className="rounded-md px-3 py-2 hover:bg-white/10">Resume</Link>
            <Link onClick={() => setOpen(false)} href="/testimonials" className="rounded-md px-3 py-2 hover:bg-white/10">Testimonials</Link>
            <Link onClick={() => setOpen(false)} href="/blogs" className="rounded-md px-3 py-2 hover:bg-white/10">Blogs</Link>
          </nav>
        </div>
      </div>

      {/* Mobile floating Theme FAB */}
      <ThemeSwitcher variant="mobile-fab" />
    </header>
  );
}