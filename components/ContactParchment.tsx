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

  // Animation Stages: 'hidden' -> 'idle' -> 'mailbox' -> 'success'
  const [animationStage, setAnimationStage] = React.useState<'hidden' | 'idle' | 'mailbox' | 'success'>('hidden');

  React.useEffect(() => {
    // 0. Trigger Entry Animation on Mount
    const timer = setTimeout(() => {
      if (animationStage === 'hidden') setAnimationStage('idle');
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  React.useEffect(() => {
    // 1. Submit -> Mailbox
    if (status === 'submitting') {
      setAnimationStage('mailbox');
    }
    // 2. Success -> Success Message
    else if (status === 'success') {
      setAnimationStage('success');
    }
    // 3. Error -> Reset to Idle
    else if (status === 'error') {
      setAnimationStage('idle');
    }
  }, [status]);

  // Variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100, rotateY: -10 },
    idle: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.8, ease: "easeOut" } },
    mailbox: { opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.5 } }, // Fade out parchment to show mailbox interaction
    success: { opacity: 0, display: 'none' }
  } as any;

  const contentVariants = {
    idle: { opacity: 1 },
    mailbox: { opacity: 0 },
    success: { opacity: 0 }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
      <AnimatePresence mode="wait">
        {animationStage !== 'success' && animationStage !== 'mailbox' && (
          <motion.div
            key="parchment-container"
            initial="hidden"
            animate={animationStage === 'hidden' ? 'hidden' : 'idle'}
            variants={containerVariants}
            className="relative shadow-2xl origin-center bg-[#d4c5a9]"
            style={{
              aspectRatio: '3/4',
              width: '100%',
              maxWidth: '28rem'
            }}
          >
            {/* 1. Base Parchment Image */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/assets/concept/parchment_paper.webp"
                alt="Parchment Paper"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* 2. Ink Overlay */}
            <motion.div
              initial="idle"
              animate={'idle'}
              variants={contentVariants}
              className="absolute inset-0 pt-[4.5rem] pb-[3rem] pl-[3rem] pr-[2rem] font-handwriting text-ink-900 flex flex-col text-slate-900"
              style={{ fontFamily: 'var(--font-handwriting)' }}
            >
              <div className="flex flex-col gap-1 text-base md:text-lg border-b border-black/5 pb-2 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold opacity-70 text-md md:text-base">From:</span>
                  <span className="font-bold pl-1 truncate opacity-90">{displayEmail}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold opacity-70 text-md md:text-base">Subject:</span>
                  <span className="font-bold opacity-90">Portfolio Inquiry</span>
                </div>
              </div>

              <div className="shrink min-h-[9rem] flex flex-col text-lg md:text-xl leading-relaxed opacity-90 break-words whitespace-pre-wrap">
                <p className="mb-2 shrink-0">Dear Jitendra,</p>
                <div
                  className="overflow-y-auto pr-2 pb-2 custom-scrollbar"
                  style={{ fontSize: '1.245rem', lineHeight: '1.35rem' }}
                >
                  {displayMessage}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-black/5 text-lg md:text-xl shrink-0 h-32 flex flex-col justify-start leading-tight">
                <p className="mb-0">Best regards,</p>
                <p className="font-bold text-xl md:text-2xl leading-none">{displayName}</p>
                <p className="font-bold text-sm md:text-base opacity-75 font-sans min-h-[1.5em] leading-tight mt-0.5">{displayMobile}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MAILBOX ANIMATION STAGE */}
        {animationStage === 'mailbox' && (
          <motion.div
            key="mailbox"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 200, transition: { duration: 0.5 } }}
            className="relative flex flex-col items-center justify-center p-10"
          >
            <motion.div
              className="text-9xl mb-4"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              📮
            </motion.div>

            {/* Visualizing "Paper entering mailbox" - plays once */}
            <motion.div
              initial={{ y: -150, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: [0, 1, 0], scale: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl absolute top-14"
            >
              📜
            </motion.div>

            <motion.p
              className="text-white/80 font-bold text-xl mt-4"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Sending to Jitendra...
            </motion.p>
          </motion.div>
        )}

        {/* SUCCESS MESSAGE */}
        {animationStage === 'success' && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
          >
            <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-white/70">Your message has been delivered.</p>
            <div className="mt-6 text-6xl">✨</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
