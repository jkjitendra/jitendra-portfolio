'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ContactParchment from '@/components/ContactParchment';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Handle input change and auto-reset status if sent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // If we're in success state (sent), typing should reset it to idle so parchment reappears
    if (status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Success
      console.log('Form Submitted via API:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', mobile: '', message: '' });

      // Status stays 'success' until user types again, triggering 'idle' via handleChange

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      // Reset error after a delay so user can try again
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClasses = "w-full bg-[rgba(var(--bg),0.8)] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-4 text-[rgb(var(--text))] placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent transition-all duration-300 backdrop-blur-sm shadow-inner";
  const labelClasses = "block text-sm font-medium text-[rgb(var(--text))] opacity-80 mb-1 ml-1";

  return (
    <main className="page-glow min-h-screen flex flex-col">

      <div className="flex-1 flex items-center justify-center p-4 pt-10 pb-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgb(var(--accent))]/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--accentAlt))]/10 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="backdrop-blur-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden relative">
              {/* Glossy sheen effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent opacity-50" />

              <div className="text-center mb-5">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--text))] to-[rgb(var(--accentAlt))]"
                >
                  Get in Touch
                </motion.h1>
                <div className="text-xs md:text-sm text-[rgb(var(--text))] opacity-60 mt-1">
                  Have a question or just want to say hi?
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClasses} py-2`}
                      placeholder="name@gmail.com"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="name" className={labelClasses}>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClasses} py-2`}
                      placeholder="Enter your name"
                    />
                  </motion.div>

                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="mobile" className={labelClasses}>Mobile <span className="text-[rgb(var(--text))] opacity-30 text-[10px] font-normal">(Optional)</span></label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`${inputClasses} py-2`}
                    placeholder="Enter your contact number"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label htmlFor="message" className={labelClasses}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClasses} py-2 resize-none`}
                    placeholder="Please leave your message here..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-1"
                >
                  <button
                    type="submit"
                    disabled={status === 'submitting' || status === 'success'}
                    className={`
                            w-full py-2.5 rounded-lg font-semibold text-white shadow-lg text-sm
                            transition-all duration-300 relative overflow-hidden group
                            ${status === 'success'
                        ? 'bg-green-500/80 hover:bg-green-500'
                        : 'bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 hover:shadow-[0_0_20px_rgb(var(--accent))/40]'
                      }
                            disabled:cursor-not-allowed disabled:opacity-80
                        `}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === 'idle' && 'Send Message'}
                      {status === 'submitting' && (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      )}
                      {status === 'success' && (
                        <>
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Sent!
                        </>
                      )}
                    </span>

                    {/* Button Hover Glow */}
                    {status === 'idle' && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-sm" />
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Parchment */}
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:mr-auto h-full flex items-center justify-center">
            <ContactParchment formData={formData} status={status} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
