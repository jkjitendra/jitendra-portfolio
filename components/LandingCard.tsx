"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingCard({ onEnter }: { onEnter: () => void }) {

  // const [showLandingPage, setShowLandingPage] = useState(false);
  return (
    <div className="landing-bg min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
        // onAnimationComplete={() => {
        //   setTimeout(() => onEnter(), 500);
        // }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-r min-h-screen overflow-hidden"
      >
      <div className="relative flex flex-col items-center border border-white/20 rounded-xl p-8 shadow-lg backdrop-blur-sm" style={{ minWidth: 340, backgroundColor: "rgba(165 117 76 / 79%)" }}>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2">
          <Image
            src="/logos/image.jpg"
            width={240}
            height={240}
            alt="Profile"
            priority={true}
            className="rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <div className="mt-[4.2rem] text-center">
          <h2 className="text-[2rem] font-bold mb-1 font-[cursive] text-[#131F48]">Jitendra Kumar Tiwari</h2>
          <p className="text-[1.3rem] mb-1" style={{ fontFamily: "Gabriola", color: "rgb(218 202 39 / 0.99)" }}>
            Code Juggler | Puzzle Fanatic | Debugging Ninja
          </p>
          <p className="mb-4 font-semibold text-[1.2rem] text-[#131F48]">Bangalore, India</p>
        </div>
        {/* Social icons (placeholders) */}
        <div className="profile-card-social">
          <Link href="https://www.linkedin.com/in/jitendra-tiwari-004943182/" className="profile-card-social__item" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/linkedin-icon.png"
              width={90}
              height={90}
              alt="LinkedIn"
              priority={true}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </Link>
          <Link href="https://github.com/jkjitendra" className="profile-card-social__item" target="_blank" rel="noopener noreferrer"> 
            <Image
              src="/logos/github-icon.png"
              width={90}
              height={90}
              alt="Github"
              priority={true}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </Link>
          <Link href="mailto:jitendrakumartiwari849@gmail.com" className="profile-card-social__item" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/gmail-icon.png"
              width={90}
              height={90}
              alt="Gmail"
              priority={true}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </Link>
          {/* <a href="https://medium.com/jkitendra" className="profile-card-social__item" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/medium-icon.png"
              width={90}
              height={90}
              alt="Medium"
              priority={true}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </a> */}
          <Link href="/home" className="profile-card-social__item" rel="noopener noreferrer">
            <Image
              src="/logos/jk_logo.png"
              width={90}
              height={90}
              alt="Portfolio"
              // priority={true}
              // fetchPriority="high"
              className="rounded-full border-4 border-white shadow-lg"
            />
          </Link>
        </div>
      </div>
      </motion.div>
    </div>
  );
}
