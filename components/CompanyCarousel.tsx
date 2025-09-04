"use client";

import Image from "next/image";
import companies from "@/data/companies.json";

type Company = {
  name: string;
  logo: string;
  url: string;
  invertOnDark?: boolean;
};

function CompanyCard({ c }: { c: Company }) {
  const src =
    c.logo.startsWith("http")
      ? c.logo
      : c.logo.startsWith("/")
      ? c.logo
      : `/${c.logo.replace(/^\.?\/*/, "")}`;

  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      title={c.name}
      aria-label={c.name}
      className={`
        relative flex items-center justify-center
        h-20 w-40
        sm:h-24 sm:w-48
        md:h-28 md:w-56
        lg:h-32 lg:w-64
        rounded-2xl
        bg-white/[0.04]
        transition
        hover:bg-white/[0.07]
        md:border-white/12 md:backdrop-blur-sm
        md:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_6px_20px_rgba(0,0,0,0.25)]
      `}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl 
        bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),transparent_30%,transparent_70%,rgba(0,0,0,0.15))] 
        opacity-40 md:opacity-50" 
      />
      <Image
        src={src}
        alt={c.name}
        width={400}
        height={120}
        className={`relative z-10 object-contain 
          h-12 sm:h-14 md:h-16 lg:h-20 w-auto 
          ${c.invertOnDark ? "dark:invert" : ""}`}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 160px,
         (max-width: 768px) 200px,
         (max-width: 1024px) 240px,
         320px"
      />
    </a>
  );
}

export default function CompanyCarousel() {
  
  // triple the list for a seamless loop even with edge fading
  const items = [
    ...(companies as Company[]),
    ...(companies as Company[]),
    ...(companies as Company[]),
  ];

  return (
    <section className="mt-10">
      <div className="container-edge">
        {/* Centered viewport: only this box shows the animation */}
        <div
          className="
            mx-auto w-full
            max-w-[320px] sm:max-w-[560px] md:max-w-[800px]
            lg:max-w-[980px] xl:max-w-[1120px]
            overflow-hidden rounded-3xl 
          border-white/10 
          bg-white/[0.03] backdrop-blur-sm
            px-2 py-5 sm:px-3 sm:py-5
            [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]
          "
        >
          <div className="inline-flex w-max animate-marquee-1of3 will-change-transform gap-4 sm:gap-6 md:gap-8">
            {items.map((c, i) => (
              <CompanyCard key={`${c.name}-${i}`} c={c} />
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}