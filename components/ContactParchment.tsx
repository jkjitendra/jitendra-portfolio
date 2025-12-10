'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type ContactParchmentProps = {
  formData: {
    name: string;
    email: string;
    mobile: string;
    message: string;
  };
  status: 'idle' | 'submitting' | 'success' | 'error';
};

export default function ContactParchment({ formData, status }: ContactParchmentProps) {
  // Logic to show clean empty states or user input
  const displayEmail = formData.email || "(Your Email)";
  const displayMessage = formData.message || "Write your message...";
  const displayName = formData.name || "(Your Name)";
  const displayMobile = formData.mobile ? formData.mobile : "";

  // The parchment rolls up when success is triggered
  // If status goes back to idle or interacting, we unroll it
  const isSent = status === 'success';

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
      <AnimatePresence mode="wait">
        {!isSent && (
          <motion.div
            key="parchment"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotateX: 0
            }}
            exit={{
              opacity: 0,
              y: -200,
              scaleY: 0.1,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-md aspect-[3/4] shadow-2xl overflow-hidden origin-top"
          >
            {/* Base Parchment Image */}
            <Image
              src="/assets/concept/parchment_paper.webp"
              alt="Parchment Paper"
              fill
              className="object-cover rounded-sm shadow-md"
              priority
            />

            {/* Ink Overlay */}
            <div className="absolute inset-0 pt-[4.5rem] pb-[3rem] pl-[3rem] pr-[2rem] font-handwriting text-ink-900 flex flex-col text-slate-900"
              style={{ fontFamily: 'var(--font-handwriting)' }}>

              {/* Header */}
              <div className="flex flex-col gap-1 text-base md:text-lg border-b border-black/5 pb-2 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold opacity-70 text-md md:text-base">From:</span>
                  <span className="font-bold truncate opacity-90">{displayEmail}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold opacity-70 text-md md:text-base">Subject:</span>
                  <span className="font-bold opacity-90">Portfolio Inquiry</span>
                </div>
              </div>

              {/* Body */}
              <div className="shrink min-h-[9rem] flex flex-col text-lg md:text-xl leading-relaxed opacity-90 break-words whitespace-pre-wrap">
                <p className="mb-2 shrink-0">Dear Jitendra,</p>
                <div
                  className="overflow-y-auto pr-2 pb-2 custom-scrollbar"
                  style={{ fontSize: '1.245rem', lineHeight: '1.35rem' }}
                >
                  {displayMessage}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-black/5 text-lg md:text-xl shrink-0 h-32 flex flex-col justify-start leading-tight">
                <p className="mb-0">Best regards,</p>
                <p className="font-bold text-xl md:text-2xl leading-none">{displayName}</p>
                <p className="font-bold text-sm md:text-base opacity-75 font-sans min-h-[1.5em] leading-tight mt-0.5">{displayMobile}</p>
              </div>
            </div>

            {/* Subtle Texture/Noise Overlay */}
            <div className="absolute inset-0 bg-yellow-900/5 mix-blend-multiply pointer-events-none" />
          </motion.div>
        )}

        {isSent && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }} // Wait for rollup
            className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
          >
            <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-white/70">Your scroll has been delivered safely.</p>
            <div className="mt-6 text-6xl">📜✨</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
