"use client";

import { goToSection } from "@/lib/nav";

export default function ChapterLink({ href, index, title }: { href: string; index: string; title: string }) {
  return (
    <div className="chapter-bridge wrap">
      <a href={href} onClick={event => { event.preventDefault(); goToSection(href); }}>
        <span className="chapter-bridge-index">NEXT / {index}</span>
        <span>{title}</span>
        <span className="chapter-bridge-arrow" aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
