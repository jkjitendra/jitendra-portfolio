"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import ContactParchment from "@/components/ContactParchment";
import ScrambleText from "./ScrambleText";

type Status = "idle" | "submitting" | "success" | "error";
const initialForm = { name: "", email: "", mobile: "", subject: "", message: "" };

export default function ContactTerminal() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Contact request failed");
      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-shell portfolio-section contact-section" aria-labelledby="contact-title">
      <div className="section-label"><span /> <ScrambleText text="CONTACT.TERMINAL" /></div>
      <div className="contact-heading"><p className="eyebrow"><ScrambleText text="// NEW_MESSAGE" /></p><h2 id="contact-title"><ScrambleText text="Let’s make the next" duration={2050} /><br /><em><ScrambleText text="system count." duration={1900} delay={180} /></em></h2><p>Have a product challenge, a performance problem, or an opportunity in mind? Send the signal.</p></div>
      <div className="contact-layout">
        <motion.form className="terminal-form" onSubmit={submit} initial={{ opacity: 0, x: -64 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <label htmlFor="portfolio-name">[&gt;&gt;&gt;] NAME*<input id="portfolio-name" name="name" required value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setStatus("idle"); }} placeholder="YOUR NAME" /></label>
          <label htmlFor="portfolio-email">[&gt;&gt;&gt;] EMAIL*<input id="portfolio-email" name="email" type="email" required value={form.email} onChange={(event) => { setForm({ ...form, email: event.target.value }); setStatus("idle"); }} placeholder="YOU@COMPANY.COM" /></label>
          <label htmlFor="portfolio-mobile">[&gt;&gt;&gt;] PHONE<input id="portfolio-mobile" name="mobile" type="tel" value={form.mobile} onChange={(event) => { setForm({ ...form, mobile: event.target.value }); setStatus("idle"); }} placeholder="+91 ..." /></label>
          <label htmlFor="portfolio-subject">[&gt;&gt;&gt;] SUBJECT*<input id="portfolio-subject" name="subject" type="text" required value={form.subject} onChange={(event) => { setForm({ ...form, subject: event.target.value }); setStatus("idle"); }} placeholder="SUBJECT" /></label>
          <label htmlFor="portfolio-message">[&gt;&gt;&gt;] MESSAGE*<textarea id="portfolio-message" name="message" required rows={5} value={form.message} onChange={(event) => { setForm({ ...form, message: event.target.value }); setStatus("idle"); }} placeholder="WHAT ARE WE BUILDING?" /></label>
          <button className="signal-button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "TRANSMITTING…" : "SEND MESSAGE ↗"}</button>
          {/* {status !== "success" && <p className={`form-status ${status}`} aria-live="polite">{status === "error" ? "> TRANSMISSION FAILED. PLEASE TRY AGAIN OR EMAIL DIRECTLY." : ""}</p>} */}
        </motion.form>
        <motion.aside className="contact-parchment-panel" aria-label="Live message preview and direct contact details" initial={{ opacity: 0, x: 64 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}>
          <ContactParchment formData={form} status={status} />
          {status === "success" && (
            <div className="contact-success-actions" aria-live="polite">
              <p className="form-status success">&gt; TRANSMISSION RECEIVED. I’LL GET BACK TO YOU SOON.</p>
              <button className="resend-button" type="button" onClick={() => setStatus("idle")}>[ ↻ ] SEND ANOTHER MESSAGE</button>
            </div>
          )}
          {status !== "success" && <p className={`form-status ${status}`} aria-live="polite">{status === "error" ? "> TRANSMISSION FAILED. PLEASE TRY AGAIN OR EMAIL DIRECTLY." : ""}</p>}
        </motion.aside>
      </div>
      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} JITENDRA KUMAR TIWARI</span><a href="#intro">BACK TO TOP ↑</a>
         <div className="parchment-direct-links">
            <a href="mailto:jitendrakumartiwari849@gmail.com">Email <span>↗</span></a>
            <a href="https://github.com/jkjitendra" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
            <a href="https://www.linkedin.com/in/jkjitendra" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
          </div>
      </footer>
    </section>
  );
}
