"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { goToSection } from "@/lib/nav";

const FRAME_COUNT = 113;
const framePath = (index: number) => `/frames/interface/${String(index).padStart(3, "0")}.svg`;
const chapters = [
  { title: "01 / Think in structure", text: "Start with the hierarchy. Give every element a reason to be here." },
  { title: "02 / Make the pieces connect", text: "Turn a layout into a clear path through the interface." },
  { title: "03 / Refine the details", text: "Bring the type, contrast and small decisions together." },
];

export default function ScrollSequence() {
  const container = useRef<HTMLDivElement>(null);
  const nearby = useInView(container, { margin: "600px 0px", once: true });
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [frame, setFrame] = useState(0);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (!reduced) setFrame(Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(value * (FRAME_COUNT - 1)))));
  });

  useEffect(() => {
    if (!nearby || reduced) return;
    let cancelled = false;
    const images = Array.from({ length: FRAME_COUNT }, (_, index) => new Promise<void>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Frame unavailable"));
      image.src = framePath(index);
    }));
    Promise.all(images).then(() => { if (!cancelled) setLoaded(true); }).catch(() => {
      // Keep the complete static illustration if the sequence cannot load.
    });
    return () => { cancelled = true; };
  }, [nearby, reduced]);

  const shown = reduced || !loaded ? FRAME_COUNT - 1 : frame;
  const chapter = Math.min(2, Math.floor(shown / FRAME_COUNT * chapters.length));
  return <div ref={container} className={`scroll-sequence ${reduced ? "sequence-static" : ""}`}>
    <div className="sequence-sticky">
      <div className="sequence-heading"><div><p className="eyebrow">113 frames / One scroll story</p><h3>From a thought.<br />To a thing.</h3></div><a href="#work-projects" onClick={event => { event.preventDefault(); goToSection("#work-projects"); }}>Skip to projects <ArrowDown size={14} /></a></div>
      <div className="sequence-stage"><Image src={framePath(shown)} alt="An original design study showing a wireframe assembling into a finished portfolio interface" width={960} height={600} sizes="(max-width: 899px) 90vw, 900px" unoptimized /><span className="sequence-counter" aria-hidden="true">FRAME {String(shown + 1).padStart(3, "0")} / {FRAME_COUNT}</span></div>
      <div className="sequence-caption"><div><h4>{chapters[chapter].title}</h4><p>{chapters[chapter].text}</p></div><span>{reduced ? "Design study / Finished interface" : "↓ Assemble · ↑ Unwind"}</span></div>
      <div className="sequence-track" aria-hidden="true"><span style={{ transform: `scaleX(${shown / (FRAME_COUNT - 1)})` }} /></div>
    </div>
  </div>;
}
