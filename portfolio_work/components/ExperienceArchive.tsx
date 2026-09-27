"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownWideNarrow } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { archiveEntries, type ArchiveCategory } from "@/content/experience";

const categories: ("All" | ArchiveCategory)[] = ["All", ...(["Experience", "Certification", "Achievement"] as ArchiveCategory[]).filter(category => archiveEntries.some(entry => entry.category === category))];
export default function ExperienceArchive() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [newest, setNewest] = useState(true);
  const ordered = [...archiveEntries].sort((a, b) => {
    if (!a.sortDate) return b.sortDate ? 1 : a.id.localeCompare(b.id);
    if (!b.sortDate) return -1;
    return newest ? b.sortDate.localeCompare(a.sortDate) : a.sortDate.localeCompare(b.sortDate);
  });
  const entries = ordered.filter(entry => category === "All" || entry.category === category);
  return <section id="experience" className="section experience-archive">
    <div className="wrap"><SectionHeading index="04" eyebrow="Experience / Credentials / Beyond code" title="A record of showing up." description="Contributions, learning and milestones — inside and outside software." />
      <div className="archive-toolbar"><div role="group" aria-label="Filter archive entries">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === "All" ? "All entries" : item === "Certification" ? "Certifications" : item === "Achievement" ? "Achievements" : item}<span>{archiveEntries.filter(entry => item === "All" || entry.category === item).length}</span></button>)}</div><button type="button" className="archive-sort" onClick={() => setNewest(value => !value)} aria-label={`Sort ${newest ? "oldest" : "newest"} first`}><ArrowDownWideNarrow size={14} />{newest ? "Newest first" : "Oldest first"}</button></div>
      <p className="archive-count" role="status">{entries.length} {entries.length === 1 ? "entry" : "entries"} · Undated records appear last</p>
      <ol className="archive-entries">{entries.map(entry => <li key={entry.id}><article className="archive-entry"><div className="archive-date"><span>{entry.period || "Undated"}</span><small>{entry.category}</small></div><div className="archive-body"><p className="eyebrow">{entry.organization}</p><h3>{entry.title}</h3><p>{entry.description}</p></div><div className="archive-resource"><span className="archive-record">{entry.id}</span>{entry.url ? <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.category === "Certification" ? "View credential" : "View record"}<ArrowUpRight size={14} /></a> : <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">CV record <ArrowUpRight size={14} /></a>}</div></article></li>)}</ol>
      {!entries.length && <p className="archive-empty">No {category === "All" ? "archive entries" : category.toLowerCase() + " entries"} published yet.</p>}
    </div>
  </section>;
}
