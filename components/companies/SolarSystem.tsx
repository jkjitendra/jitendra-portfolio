"use client";

import Image from "next/image";
import companies from "@/data/companies.json";

// Order: Innermost -> Outermost
const ORDER = ["Infosys Ltd.", "NCSI Technologies", "DBS Bank", "Cricbuzz"];

export default function SolarSystem() {
  // Sort companies based on the ORDER array
  const sortedCompanies = [...companies].sort((a, b) => {
    return ORDER.indexOf(a.name) - ORDER.indexOf(b.name);
  });

  const orbitGroups = sortedCompanies.map(c => [c]);

  return (
    <div className="relative w-full h-[600px] overflow-visible flex items-center justify-center">
      {/* Central "Sun" - The User / Portfolio Core */}
      <div className="absolute z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-[20px] opacity-40 animate-pulse" />
      <div className="absolute z-10 w-16 h-16 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-2xl shadow-blue-500/20 z-20">
        <span className="text-2xl">⚡️</span>
      </div>

      {/* Orbits */}
      {orbitGroups.map((group, orbitIndex) => {
        const radius = 90 + orbitIndex * 55;
        const duration = 20 + orbitIndex * 10;
        const isCV = orbitIndex % 2 === 0; // Clockwise if even index
        const animationName = isCV ? 'orbit-cw' : 'orbit-ccw';
        const counterDateAnimationName = isCV ? 'orbit-ccw' : 'orbit-cw';

        return (
          <div
            key={`orbit-${orbitIndex}`}
            className="absolute rounded-full border transition-colors duration-300 border-black/10 dark:border-white/10 pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
          >
            {/* Rotating Ring Container */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                animation: `${animationName} ${duration}s linear infinite`,
                willChange: 'transform' // Hint browser to optimize
              }}
            >
              {group.map((company, index) => {
                const angle = (360 / group.length) * index;
                const visualAngle = angle + (orbitIndex * 45);

                return (
                  <div
                    key={company.name}
                    className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 flex items-center justify-center pointer-events-auto"
                    style={{
                      transform: `rotate(${visualAngle}deg) translateY(-${radius}px) rotate(-${visualAngle}deg)`,
                    }}
                  >
                    {/* Counter-rotating Logo Container */}
                    <div
                      className="w-full h-full"
                      style={{
                        animation: `${counterDateAnimationName} ${duration}s linear infinite`,
                        willChange: 'transform'
                      }}
                    >
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full rounded-full flex items-center justify-center p-2 shadow-sm transition-all cursor-pointer group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:scale-[3] hover:border-blue-500 hover:shadow-blue-500/20"
                      >
                        <CompanyLogo company={company} />

                        {/* Tooltip */}
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

  return (
    <Image
      src={src}
      alt={company.name}
      width={40}
      height={40}
      className={`object-contain w-full h-full p-1 opacity-80 group-hover:opacity-100 transition-opacity dark:invert-0 ${company.invertOnDark === false ? "" : "dark:invert"}`}
    />
  )
}
