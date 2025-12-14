"use client";

import Image from "next/image";
import companies from "@/data/companies.json";

type Company = {
  name: string;
  logo: string;
  darkLogo?: string;
  url: string;
  invertOnDark?: boolean;
};

// 0 = innermost orbit, 3 = outermost orbit
const PLACEMENT: Record<string, { orbitIndex: number; angle: number }> = {
  "Infosys Ltd.": { orbitIndex: 0, angle: 180 },         // South
  "NCSI Technologies": { orbitIndex: 1, angle: 90 },      // East
  "DBS Bank": { orbitIndex: 2, angle: 270 },              // West
  "Cricbuzz": { orbitIndex: 3, angle: 0 },                // North
};

export default function SolarSystem() {
  // Build 4 orbit buckets, fixed by orbitIndex
  const orbitGroups: Array<Array<Company & { fixedAngle?: number }>> =
    Array.from({ length: 4 }, () => []);

  for (const c of companies as Company[]) {
    const p = PLACEMENT[c.name];
    if (!p) continue;
    orbitGroups[p.orbitIndex].push({ ...c, fixedAngle: p.angle });
  }

  return (
    <div className="relative w-full h-[600px] overflow-visible flex items-center justify-center">
      {/* Sun */}
      <div className="absolute z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-[20px] opacity-40 animate-pulse" />
      <div className="absolute z-10 w-16 h-16 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-2xl shadow-blue-500/20 z-20">
        <span className="text-2xl">⚡️</span>
      </div>

      {/* Orbits */}
      {orbitGroups.map((group, orbitIndex) => {
        const radius = 90 + orbitIndex * 55;
        const duration = 20 + orbitIndex * 10;

        const isClockwise = [1, 3].includes(orbitIndex);
        const ringAnim = isClockwise ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isClockwise ? "orbit-ccw" : "orbit-cw";

        return (
          <div
            key={`orbit-${orbitIndex}`}
            className="absolute rounded-full border transition-colors duration-300 border-black/10 dark:border-white/10 pointer-events-none"
            style={{ width: radius * 2, height: radius * 2 }}
          >
            {/* Rotating Ring */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                animation: `${ringAnim} ${duration}s linear infinite`,
                willChange: "transform",
              }}
            >
              {group.map((company, index) => {
                // If fixedAngle exists, it pins the starting position (N/E/S/W)
                const computedAngle = (360 / group.length) * index;
                const visualAngle = company.fixedAngle ?? computedAngle;

                return (
                  <div
                    key={company.name}
                    className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 flex items-center justify-center pointer-events-auto"
                    style={{
                      transform: `rotate(${visualAngle}deg) translateY(-${radius}px) rotate(-${visualAngle}deg)`,
                    }}
                  >
                    {/* Counter-rotating Logo */}
                    <div
                      className="w-full h-full"
                      style={{
                        animation: `${counterAnim} ${duration}s linear infinite`,
                        willChange: "transform",
                      }}
                    >
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full rounded-full flex items-center justify-center p-2 shadow-sm transition-all cursor-pointer group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:scale-[3] hover:border-blue-500 hover:shadow-blue-500/20"
                      >
                        <CompanyLogo company={company} />

                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs text-white pointer-events-none z-50">
                          {company.name}
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompanyLogo({ company }: { company: any }) {
  const src = company.logo.startsWith("/")
    ? company.logo
    : `/${company.logo.replace(/^\.?\/*/, "")}`;

  if (company.darkLogo && company.darkLogo !== company.logo) {
    const darkSrc = company.darkLogo.startsWith("/")
      ? company.darkLogo
      : `/${company.darkLogo.replace(/^\.?\/*/, "")}`;

    return (
      <>
        <Image
          src={src}
          alt={company.name}
          width={40}
          height={40}
          className="object-contain w-full h-full p-1 opacity-80 group-hover:opacity-100 transition-opacity dark:hidden"
        />
        <Image
          src={darkSrc}
          alt={company.name + " Dark Mode"}
          width={40}
          height={40}
          className="object-contain w-full h-full p-1 opacity-80 group-hover:opacity-100 transition-opacity hidden dark:block"
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={company.name}
      width={40}
      height={40}
      className={`object-contain w-full h-full p-1 opacity-80 group-hover:opacity-100 transition-opacity dark:invert-0 ${company.invertOnDark === false ? "" : "dark:invert"}`}
    />
  );
}
