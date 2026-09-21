"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/content";
import { heroCopy } from "@/lib/data";
import { goToSection } from "@/lib/nav";
import { useIntroReady } from "./CinematicIntro";

export default function Hero({ personalInfo }: { personalInfo: Profile }) {
  const ready = useIntroReady();
  const [firstName, ...rest] = personalInfo.name.trim().split(/\s+/);
  const surname = rest.join(" ");

  return (
    <section className="name-hero" aria-labelledby="hero-heading">
      <div className="wrap name-hero-inner">
        <p className="eyebrow name-hero-kicker">Portfolio / {personalInfo.location}</p>
        <motion.h1 id="hero-heading" className="name-hero-title" aria-label={personalInfo.name}
          initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
          <span className="name-hero-solid" aria-hidden="true">{firstName}</span>
          {surname && <span className="name-hero-outline" aria-hidden="true">{surname}</span>}
        </motion.h1>
        <div className="name-hero-bottom">
          <div className="name-hero-role"><span aria-hidden="true" /><p>{personalInfo.role}</p></div>
          <p className="name-hero-statement">{heroCopy.description}</p>
          <a href="#about" className="name-hero-scroll" onClick={event => { event.preventDefault(); goToSection("#about"); }} aria-label="Scroll to about me"><ArrowDown size={22} strokeWidth={1.4} /></a>
        </div>
      </div>
    </section>
  );
}
