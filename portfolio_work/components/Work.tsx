import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";
import type { Project } from "@/lib/data";

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={`showcase-card ${featured ? "showcase-featured" : ""}`}>
      <Link href={`/projects/${project.id}`} className="showcase-preview" aria-label={`Explore ${project.title}`}><ProjectVisual project={project} /></Link>
      <div className="showcase-copy">
        <p className="eyebrow">{featured ? "Featured project · " : ""}{project.context}</p>
        <h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3>
        <p className="showcase-summary">{project.summary}</p>
        <ul className="showcase-stack" aria-label="Technologies">{project.stack.slice(0, 4).map(item => <li className="tag" key={item}>{item}</li>)}{project.stack.length > 4 && <li className="tag">+{project.stack.length - 4} more</li>}</ul>
        <div className="showcase-links">
          <Link href={`/projects/${project.id}`} className="showcase-case-link">Explore case study <ArrowUpRight size={17} /></Link>
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={14} /></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer">Source <ArrowUpRight size={14} /></a>}
        </div>
      </div>
    </article>
  );
}

export default function Work({ projects }: { projects: Project[] }) {
  const featured = projects.find(project => project.featured);
  const rest = projects.filter(project => !project.featured);
  return (
    <section id="work" className="section" style={{ "--section-accent": "var(--c-violet)" } as React.CSSProperties}>
      <div className="wrap">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading index="02" eyebrow="Selected work" title="Ideas, brought to life." description="From interfaces to physical systems. Explore the work, the thinking and my contribution." />
          {process.env.NODE_ENV !== "production" && <Link href="/admin" className="btn btn-ghost btn-sm"><Plus size={15} />Edit projects</Link>}
        </div>
        {featured && <Reveal><ProjectCard project={featured} featured /></Reveal>}
        <div className="showcase-grid">{rest.map(project => <Reveal key={project.id}><ProjectCard project={project} /></Reveal>)}</div>
      </div>
    </section>
  );
}
