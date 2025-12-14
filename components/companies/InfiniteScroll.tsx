"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import companies from "@/data/companies.json";

type Company = {
  name: string;
  logo: string;
  url: string;
  invertOnDark?: boolean;
};

export default function InfiniteScroll() {
  const companyList = companies as Company[];
  const duplicatedList = [...companyList, ...companyList, ...companyList]; // Triple for smoothness

  return (
    <div className="w-full overflow-hidden py-10 sm:py-20 relative select-none">
      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center gap-12 sm:gap-20 min-w-max"
        animate={{ x: "-33.33%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Adjust speed
        }}
        whileHover={{ animationPlayState: "paused" }} // Note: Framer motion doesn't support play state directly easily on hover with simple animate prop, 
      // but we can use vanilla css or advanced motion values. 
      // For simplicity with framer motion loop, pause on hover is tricky without motion value control.
      // Let's use a simpler CSS approach for the marquee container if we want easy pause-on-hover, 
      // or just accept continuous scroll for now and add hover effects on items.
      >
        {duplicatedList.map((company, index) => {
          const src = company.logo.startsWith("/")
            ? company.logo
            : `/${company.logo.replace(/^\.?\/*/, "")}`;

          return (
            <a
              key={`${company.name}-${index}`}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
            >
              <Image
                src={src}
                alt={company.name}
                width={120}
                height={60}
                className={`
                  object-contain w-auto h-8 sm:h-12 
                  ${company.invertOnDark ? "dark:invert" : ""}
                `}
              />
            </a>
          )
        })}
      </motion.div>
    </div>
  );
}
