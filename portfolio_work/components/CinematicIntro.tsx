"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";

const IntroReady = createContext(true);
export const useIntroReady = () => useContext(IntroReady);
const DURATION = 2400;

export default function CinematicIntro({ name, children }: { name: string; children: React.ReactNode }) {
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const finish = useCallback(() => {
    restoreFocus.current = !!overlay.current?.contains(document.activeElement);
    try { localStorage.setItem("portfolio-intro-seen", "1"); } catch { /* Storage may be unavailable. */ }
    setFinished(true);
  }, []);

  useEffect(() => {
    if (finished) return;
    let seen = false;
    try { seen = localStorage.getItem("portfolio-intro-seen") === "1"; } catch { /* Keep the skip button available. */ }
    // Returning visitors, deep links and reduced-motion visits go straight in.
    if (seen || window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(frame);
    }
    const node = content.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (node) node.inert = true;
    skip.current?.focus({ preventScroll: true });
    const started = performance.now();
    const timer = window.setInterval(() => {
      const value = Math.min(100, Math.floor((performance.now() - started) / DURATION * 100));
      setProgress(value);
      if (value === 100) finish();
    }, 40);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", escape);
      document.body.style.overflow = previousOverflow;
      if (node) node.inert = false;
    };
  }, [finished, finish]);

  return <IntroReady.Provider value={finished}>
    <noscript><style>{`.cinematic-intro { display: none !important; }`}</style></noscript>
    <div ref={content}>{children}</div>
    <AnimatePresence onExitComplete={() => {
      if (restoreFocus.current) content.current?.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    }}>
      {!finished && <motion.div ref={overlay} className="cinematic-intro" role="dialog" aria-modal="true" aria-label="Welcome to the portfolio" initial={false} exit={{ opacity: 0 }} transition={{ duration: .45, ease: "easeInOut" }}>
        <div className="cinematic-top"><span className="cinematic-brand">{name}<span>PERSONAL PORTFOLIO</span></span><button ref={skip} type="button" className="cinematic-skip" onClick={finish}>Skip intro <ArrowUpRight size={15} /></button></div>
        <div className="cinematic-centre">
          <p className="cinematic-eyebrow">A LITTLE WINDOW INTO MY WORLD</p>
          <h2>Thoughtfully built.<br /><em>Personally yours.</em></h2>
          <div className="cinematic-search" role="progressbar" aria-label="Portfolio intro progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span className="cinematic-fill" style={{ transform: `scaleX(${progress / 100})` }} />
            <Search size={20} aria-hidden="true" /><span>{name.toLowerCase()}<span className="cinematic-path"> / creative space</span><span className="cinematic-caret" aria-hidden="true" /></span><span className="cinematic-percent">{String(progress).padStart(2, "0")}%</span>
          </div>
          <div className="cinematic-meta" aria-hidden="true"><span>{progress < 40 ? "A little code." : progress < 75 ? "A little character." : "Welcome to my corner."}</span><span>MADE WITH CURIOSITY ↗</span></div>
        </div>
        <div className="cinematic-bottom"><span>Ideas → interfaces → experiences</span><span>SCROLL. EXPLORE. SAY HELLO.</span></div>
      </motion.div>}
    </AnimatePresence>
  </IntroReady.Provider>;
}
