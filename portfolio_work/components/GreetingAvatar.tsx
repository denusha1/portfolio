"use client";

import { useIntroReady } from "./CinematicIntro";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useInView } from "framer-motion";

export default function GreetingAvatar({ name, photoSrc = "/profile.jpg", fullBody = false }: { name: string; photoSrc?: string; fullBody?: boolean }) {
  const introReady = useIntroReady();
  const scene = useRef<HTMLDivElement>(null);
  const inView = useInView(scene, { amount: .35, once: true });
  const [hour, setHour] = useState<number | null>(null);
  const [greeting, setGreeting] = useState(0);
  const [waving, setWaving] = useState(true);
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [showPhoto, setShowPhoto] = useState(false);
  const [intro, setIntro] = useState(0);
  const reduced = useReducedMotion();
  const portrait = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const eyeX = useSpring(x, { stiffness: 140, damping: 22 });
  const eyeY = useSpring(y, { stiffness: 140, damping: 22 });

  useEffect(() => {
    if (!introReady || !inView) return;
    const timer = window.setTimeout(() => setShowPhoto(true), 5500);
    return () => window.clearTimeout(timer);
  }, [intro, introReady, inView]);

  useEffect(() => {
    const update = () => setHour(new Date().getHours());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const reset = () => { x.set(0); y.set(0); };
    if (reduced) { reset(); return; }
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = portrait.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      x.set(Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width * .57) / 65)));
      y.set(Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height * .26) / 85)));
    };
    window.addEventListener("pointermove", follow, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", follow);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [reduced, x, y]);

  const welcome = hour === null ? "Hi" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const tamilWelcome = hour === null ? "வணக்கம்" : hour < 12 ? "காலை வணக்கம்" : hour < 17 ? "மதிய வணக்கம்" : "மாலை வணக்கம்";
  const greetings = language === "ta"
    ? [`${tamilWelcome}!`, `வணக்கம்! நான் ${name}.`, "உங்களைச் சந்தித்ததில் மகிழ்ச்சி!", "சேர்ந்து உருவாக்கலாம்!"]
    : [`${welcome}, I’m ${name}!`, "Hello there!", "Lovely to meet you!", "Let’s build something lovely."];
  // Separate the raised hand at its wrist so the greeting has a gentle wave.
  const hand = "M0 430 H345 V790 Q290 890 235 975 L115 935 Q45 810 0 760 Z";
  return (
    <div ref={scene} className="greeting-experience">
    <div className="greeting-language" role="group" aria-label="Greeting language">
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
      <button type="button" lang="ta" aria-pressed={language === "ta"} onClick={() => setLanguage("ta")}>தமிழ்</button>
    </div>
    <button type="button" className="hello-avatar" onPointerEnter={() => setWaving(true)} onPointerLeave={() => setWaving(false)} onFocus={() => setWaving(true)} onBlur={() => setWaving(false)} onClick={() => { setGreeting(value => (value + 1) % greetings.length); setWaving(true); }} aria-label={`Say hi to ${name} — change greeting`}>
      <span className="hello-bubble" lang={language} aria-live="polite" aria-atomic="true"><span className="hello-wave" aria-hidden="true">👋</span>{greetings[greeting]}</span>
      <span className={`hello-portrait hello-portrait-interactive ${showPhoto ? "showing-photo" : ""}`}>
        <motion.svg animate={{ opacity: showPhoto ? 0 : 1 }} transition={{ duration: reduced ? 0 : .7 }} aria-hidden={showPhoto} ref={portrait} viewBox="0 0 1145 1374" role="img" aria-label={`${name} smiling and waving in a lavender hoodie`}>
          <defs>
            <mask id={`${id}-body`}><rect width="1145" height="1374" fill="white" /><path d={hand} fill="black" /></mask>
            <clipPath id={`${id}-hand`}><path d={hand} /></clipPath>
            <radialGradient id={`${id}-fade`}><stop offset="55%" stopColor="white" /><stop offset="100%" stopColor="black" /></radialGradient>
            <mask id={`${id}-eyes`}><ellipse cx="575" cy="366" rx="47" ry="25" fill={`url(#${id}-fade)`} /><ellipse cx="727" cy="345" rx="44" ry="25" fill={`url(#${id}-fade)`} /></mask>
          </defs>
          <image href="/denusha-hi.png" width="1145" height="1374" mask={`url(#${id}-body)`} />
          <g mask={`url(#${id}-eyes)`}><motion.image href="/denusha-hi.png" width="1145" height="1374" style={{ x: eyeX, y: eyeY }} /></g>
          <motion.g animate={{ rotate: introReady && inView && waving && !reduced ? [0, 3, -2, 3, 0] : 0 }} transition={{ duration: 1.1 }} style={{ originX: "18%", originY: "68%" }}><image href="/denusha-hi.png" width="1145" height="1374" clipPath={`url(#${id}-hand)`} /></motion.g>
        </motion.svg>
        <motion.span className={`hello-real-photo ${fullBody ? "hello-full-body" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: showPhoto ? 1 : 0 }} transition={{ duration: reduced ? 0 : .7 }} aria-hidden={!showPhoto}>
          <Image src={photoSrc} alt={`${name} — ${fullBody ? "full-body profile cutout" : "the person behind the portfolio"}`} fill sizes="(max-width: 767px) 90vw, 460px" priority />
          {!fullBody && <span className="hello-photo-caption">{name}<small>The person behind the pixels.</small></span>}
        </motion.span>
      </span>
      <span className="hello-hint">A little wave. A big welcome.<span>Tap to say hi ↗</span></span>
    </button>
    <div className="greeting-view" role="group" aria-label="Portrait view">
      <button type="button" aria-pressed={!showPhoto} onClick={() => { setShowPhoto(false); setWaving(true); setIntro(value => value + 1); }}>↻ Replay hello</button>
      <button type="button" aria-pressed={showPhoto} onClick={() => setShowPhoto(true)}>Meet the real me</button>
    </div>
    </div>
  );
}
