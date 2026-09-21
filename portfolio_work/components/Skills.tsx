"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Search, X, LayoutGrid, List, RotateCcw } from "lucide-react";
import SectionHeading from "./SectionHeading";
import type { SkillGroup } from "@/lib/content";
import type { Project } from "@/lib/data";
import { goToSection } from "@/lib/nav";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const stackAliases: Record<string, string[]> = {
  pythonflask: ["python", "flask"],
  supabasepostgresql: ["supabase", "postgresql"],
};

export default function Skills({ skills, projects }: { skills: SkillGroup[]; projects: Project[] }) {
  const initialCategory = skills.find(group => group.group === "Frontend")?.group ?? skills[0]?.group ?? "All";
  const [category, setCategory] = useState(initialCategory);
  const [view, setView] = useState<"cards" | "list">("cards");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("React");
  const id = useId();
  const entries = skills.flatMap(group => group.items.map(name => ({ name, group: group.group, note: group.note })));
  const filtered = entries.filter(item => (category === "All" || item.group === category) && `${item.name} ${item.group}`.toLowerCase().includes(query.trim().toLowerCase()));
  const activeGroup = skills.find(group => group.group === category);
  const chooseCategory = (group: string) => {
    setCategory(group);
    setQuery("");
    setSelected(group === "All" ? entries[0]?.name ?? "" : skills.find(item => item.group === group)?.items[0] ?? "");
  };
  const current = filtered.find(item => item.name === selected) ?? filtered[0];
  const related = current ? projects.filter(project => project.stack.some(technology => {
    const normalized = normalize(technology);
    return normalized === normalize(current.name) || stackAliases[normalized]?.includes(normalize(current.name));
  })) : [];

  return <section id="skills" className="section" style={{ background: "var(--bg-subtle)", "--section-accent": "var(--c-teal)" } as React.CSSProperties}>
    <div className="wrap">
      <SectionHeading index="03" eyebrow="Technical inventory / Explore" title="What I build with" description="Explore by category, inspect a technology and follow it into the work." />
      <div className="skill-dashboard">
      <div className="skill-dashboard-bar"><span><span className="dashboard-status-dot" aria-hidden="true" />TOOLKIT / EXPLORER</span><span>{skills.length} AREAS · {entries.length} TECHNOLOGIES</span><button type="button" onClick={() => { chooseCategory(initialCategory); setView("cards"); }}><RotateCcw size={12} />Reset view</button></div>
      <div className="skill-explorer">
        <aside className="skill-categories"><p className="eyebrow">01 / Categories</p><div role="group" aria-label="Skill categories">{["All", ...skills.map(group => group.group)].map(group => <button type="button" key={group} aria-pressed={category === group} aria-controls={`${id}-catalog`} onClick={() => chooseCategory(group)}><span>{group}</span><span>{group === "All" ? entries.length : entries.filter(item => item.group === group).length}</span></button>)}</div></aside>
        <div id={`${id}-catalog`} className="skill-catalog" role="region" aria-labelledby={`${id}-category-title`}><div className="skill-category-heading"><p className="eyebrow">02 / Technology inventory</p><h3 id={`${id}-category-title`}>{category === "All" ? "All technologies" : category}</h3><p>{activeGroup?.note || "Select a technology to inspect its project connections."}</p></div><label htmlFor={id} className="eyebrow">Search this category</label><div className="skill-search"><Search size={16} aria-hidden="true" /><input id={id} type="search" placeholder={`Search ${category === "All" ? "all technologies" : category.toLowerCase()}…`} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear skill search"><X size={15} /></button>}</div><div className="skill-results-toolbar"><p className="skill-result-count" role="status">{filtered.length} {filtered.length === 1 ? "technology" : "technologies"}</p><div role="group" aria-label="Technology view"><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")}><LayoutGrid size={13} />Cards</button><button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={13} />List</button></div></div>
          <div className={`skill-options ${view === "list" ? "skill-options-list" : ""}`} role="group" aria-label="Select a skill">{filtered.map(item => <button type="button" key={`${item.group}-${item.name}`} aria-pressed={current?.name === item.name} aria-controls={`${id}-detail`} onClick={() => setSelected(item.name)}><span>{item.name}</span><small>{item.group}</small><ArrowUpRight size={13} aria-hidden="true" /></button>)}</div>
          {!filtered.length && <div className="skill-empty"><p>No skills match this search.</p><button type="button" className="btn btn-ghost btn-sm" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}
        </div>
        <div id={`${id}-detail`} className="skill-detail" aria-live="polite" aria-atomic="true"><p className="eyebrow">03 / Selected technology</p>{current ? <><h3>{current.name}</h3><dl><div><dt>Category</dt><dd>{current.group}</dd></div>{current.note && <div><dt>Category note</dt><dd>{current.note}</dd></div>}<div><dt>Linked case studies</dt><dd>{String(related.length).padStart(2, "0")}</dd></div></dl>{related.length ? <ul>{related.map(project => <li key={project.id}><a href={`#project-${project.id}`} onClick={event => { event.preventDefault(); goToSection(`#project-${project.id}`); }}><span>{project.title}</span><ArrowUpRight size={16} /></a><p>{project.context}</p></li>)}</ul> : <p className="skill-detail-note">Listed in my toolkit. A case study using this skill hasn’t been linked here yet.</p>}</> : <p className="skill-detail-note">Try another search or reset the filters to explore the toolkit.</p>}</div>
      </div>
      </div>
    </div>
  </section>;
}
