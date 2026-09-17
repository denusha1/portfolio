"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Download, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import type { Profile } from "@/lib/content";
import { heroCopy, type Project } from "@/lib/data";
import { goToSection } from "@/lib/nav";

const entrance = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };

export default function Hero({ personalInfo, featuredProject }: {
  personalInfo: Profile;
  featuredProject?: Project;
}) {
  const availability = personalInfo.facts.find((fact) => fact.label.toLowerCase() === "status")?.value;

  return (
    <section className="studio-hero" aria-labelledby="hero-heading">
      <div className="studio-hero-glow" aria-hidden="true" />
      <div className="wrap relative z-10">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
          <motion.div variants={entrance} transition={transition} className="studio-topline">
            <p className="studio-wordmark"><span className="studio-monogram" aria-hidden="true">DT</span>{personalInfo.shortName}’s engineering studio</p>
            {availability && <p className="studio-availability"><span aria-hidden="true" />{availability}</p>}
          </motion.div>

          <div className="studio-grid">
            <div className="studio-copy">
              <motion.p variants={entrance} transition={transition} className="eyebrow studio-intro">Hello, I’m {personalInfo.name}</motion.p>
              <motion.h1 variants={entrance} transition={transition} id="hero-heading" className="studio-title">
                {heroCopy.headline}<br /><span>{heroCopy.highlight}</span><br />{heroCopy.ending}
              </motion.h1>
              <motion.p variants={entrance} transition={transition} className="studio-description">{heroCopy.description}</motion.p>
              <motion.div variants={entrance} transition={transition} className="studio-actions">
                <a href="#work" className="btn studio-primary" onClick={(event) => { event.preventDefault(); goToSection("#work"); }}>View my work <ArrowUpRight size={18} /></a>
                <a href="/cv.pdf" download className="btn btn-ghost"><Download size={16} /> Download résumé</a>
              </motion.div>
              <motion.div variants={entrance} transition={transition} className="studio-connect">
                <span className="studio-connect-label">Let’s connect</span>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label="Visit my GitHub" className="icon-btn"><GithubIcon size={18} /></a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Visit my LinkedIn" className="icon-btn"><LinkedinIcon size={18} /></a>
                <a href={`mailto:${personalInfo.email}`} className="studio-email">Say hello <ArrowUpRight size={14} /></a>
              </motion.div>
            </div>

            <motion.div variants={entrance} transition={transition} className="studio-visual">
              <div className="studio-photo-frame">
                <div className="studio-photo">
                  <Image src="/profile.jpg" alt={personalInfo.name} fill sizes="(max-width: 767px) 90vw, 420px" priority />
                  <div className="studio-photo-caption"><span>{personalInfo.shortName}</span><span><MapPin size={12} />{personalInfo.location}</span></div>
                </div>
                <span className="studio-photo-note">The person behind the pixels.</span>
                <span className="studio-photo-spark" aria-hidden="true">✳</span>
              </div>
              {featuredProject && (
                <Link href={`/projects/${featuredProject.id}`} className="studio-featured">
                  <div className="studio-featured-icon" aria-hidden="true"><ArrowDownRight size={25} /></div>
                  <div className="studio-featured-copy"><span className="eyebrow">Featured project</span><h2>{featuredProject.title}</h2><p>{featuredProject.stack.slice(0, 3).join(" · ")}</p></div>
                  <ArrowUpRight size={19} className="studio-featured-arrow" aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          </div>

          <motion.div variants={entrance} transition={transition} className="studio-footer">
            <div><span className="eyebrow">Currently</span><p>{personalInfo.role}</p></div>
            <div><span className="eyebrow">Learning & building at</span><p>{personalInfo.university}</p></div>
            <a href="#about" className="studio-scroll" onClick={(event) => { event.preventDefault(); goToSection("#about"); }}>A little more about me <ArrowDown size={16} /></a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
