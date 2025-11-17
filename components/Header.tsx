"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { usePathname } from "next/navigation";


type NavItem = { href: `/${string}` | "/"; label: string };

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/tech-radar", label: "Tech Radar" },
  { href: "/resume", label: "Resume" },
  // { href: "/testimonials", label: "Testimonials" },
  // { href: "/blogs", label: "Blogs" },
] as const satisfies readonly NavItem[];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const pathname = usePathname();
  
  /** Active-state Helper*/
  const isActive = (href: NavItem["href"]): boolean => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) ?? false;
  };

  /** Centralized close handler (prevents aria-hidden warning) */
  const closeMenu = () => {
    // Remove focus from any element inside the drawer before hiding it
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active) active.blur();
    });
    setOpen(false);
  };


  /** Scroll effect for header shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Prevent body scroll when menu open */
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  /** Close on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /** Close when clicking outside the drawer */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open || !panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 shadow-sm backdrop-blur-md 
              bg-[rgb(var(--bg)/0.70)] m:bg-[rgb(var(--bg)/0.70)]"
      >
        <div className="mx-auto max-w-[70rem] flex items-center justify-between gap-[0.5rem] px-3 py-3">
          {/* LEFT: Logo */}
          <Link href="/" aria-label="Landing Page" className="relative z-10 shrink-0 360-380:ml-[-2rem] 360-380:mr-[-1rem] 400-420:ml-[-1.5rem] 400-420:mr-[2rem] ml-[-1rem] sm:ml-[-1.5rem] lg:ml-[-2rem]">
            <div className="relative h-8 sm:h-9 md:h-10 w-[120px] sm:w-[140px] md:w-[160px]">
              <Image
                src="/logos/jk_logo.png"
                alt="Jitendra Logo"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
                className="object-contain [filter:drop-shadow(0_0_10px_rgba(0,0,0,0.35))]"
              />
            </div>
          </Link>

          {/* MIDDLE: Nav pushed to the right */}
          <nav className="hidden md:flex ml-auto items-center gap-6 lg:gap-8 text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  isActive(href)
                    ? "text-[rgb(var(--accentAlt))] font-semibold"
                    : "hover:text-[rgb(var(--accentAlt))]"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Theme switcher on desktop */}
          {/* <div className="hidden md:block md:ml-4 md:mr-2 lg:mr-4 ml-auto bg-[rgb(197 221 255 / 0.12)] rounded-md"> */}
          <div className="hidden md:block md:ml-4 md:mr-2 lg:mr-4 ml-auto">
            <ThemeSwitcher />
          </div>

          {/* Hamburger (mobile) — stays at the far right on small screens */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              if (open) {
                requestAnimationFrame(() => document.body.focus());
              }
              setOpen(v => !v);
            }}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10"
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
          <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" :    "opacity-0"}`} 
          onClick={closeMenu}
            // style={{ backgroundColor: "rgba(var(--bg),0.5)" }} 
          />
          <div
            ref={panelRef}
            className={`absolute right-0 top-0 w-72 h-[57rem] max-w-[85%] border-l border-white/10 shadow-xl transition-transform duration-300 mobile-menu-panel ${open ? "translate-x-0" : "translate-x-full"}`}
            role="dialog" aria-modal="true"
          >
            <div className="px-5 pt-[0.5rem] pb-[1rem] border-b border-white/10 flex items-center justify-between mobile-menu-header">
              <Link
                onClick={closeMenu}
                href="/home"
                className={`rounded-md px-3 py-2 hover:bg-white/10 text-white font-medium ${
                  isActive("/home") ? "bg-white/20 text-[rgb(var(--accentAlt))]" : ""
                }`}
                aria-current={isActive("/home") ? "page" : undefined}
              >
                Home
              </Link>
              <button aria-label="Close menu" onClick={closeMenu} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" /></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 text-base mobile-menu-nav">
              {NAV_LINKS.filter((l) => l.href !== "/home").map(({ href, label }) => (
                <Link
                  key={href}
                  onClick={closeMenu}
                  href={href}
                  className={`mobile-menu-item rounded-md px-3 py-2 transition-colors ${
                    isActive(href)
                      ? "bg-white/20 font-semibold text-[rgb(var(--accentAlt))]"
                      : "hover:bg-white/10"
                  }`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}