"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { ProjectMedia } from "@/lib/data";

export default function ProjectGallery({ media, title }: { media: ProjectMedia[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const ordered = [...media.filter(item => item.kind === "image"), ...media.filter(item => item.kind !== "image")];
  const index = Math.min(selected, Math.max(0, ordered.length - 1));
  const current = ordered[index];
  const move = (delta: number) => setSelected((index + delta + ordered.length) % ordered.length);
  if (!current) return null;
  return <div className="case-gallery-preview">
    <figure>
      <div className="case-gallery-screen">
        {current.kind === "image" ? <a href={current.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screenshot: ${current.caption || title}`}><Image src={current.src} alt={current.caption || `${title} screenshot ${index + 1}`} fill sizes="(max-width: 899px) 90vw, 65vw" className="object-contain" /><span className="case-gallery-expand"><ArrowUpRight size={15} />Full size</span></a> : <video key={current.src} src={current.src} controls playsInline preload="metadata" aria-label={current.caption || `${title} walkthrough`} />}
      </div>
      <figcaption aria-live="polite" aria-atomic="true"><span>{current.caption || title}</span><span>{String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}</span></figcaption>
    </figure>
    {ordered.length > 1 && <div className="gallery-navigation"><span className="eyebrow">Explore the project views</span><div><button type="button" onClick={() => move(-1)} aria-label="Previous project image"><ArrowLeft size={16} /></button><button type="button" onClick={() => move(1)} aria-label="Next project image"><ArrowRight size={16} /></button></div></div>}
    {ordered.length > 1 && <div className="case-gallery-thumbs" role="group" aria-label={`${title} project media`}>{ordered.map((item, mediaIndex) => <button type="button" key={`${mediaIndex}-${item.src}`} aria-pressed={mediaIndex === index} aria-label={`Show ${item.kind === "image" ? "screenshot" : "video"} ${mediaIndex + 1}: ${item.caption || title}`} onClick={() => setSelected(mediaIndex)}>{item.kind === "image" ? <Image src={item.src} alt="" fill sizes="100px" className="object-contain" /> : <Play size={20} aria-hidden="true" />}<span>{String(mediaIndex + 1).padStart(2, "0")}</span></button>)}</div>}
  </div>;
}
