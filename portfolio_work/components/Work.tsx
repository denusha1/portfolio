import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";
import ProjectGallery from "./ProjectGallery";
import ScrollSequence from "./ScrollSequence";
import ProjectPlayground from "./ProjectPlayground";
import type { Project } from "@/lib/data";

function ProjectCaseStudy({ project, index }: { project: Project; index: number }) {
  const media = project.media ?? [];
  const interactive = ["pms", "blogapp", "cnc"].includes(project.id);
  const story = project.caseStudy;
  return <article id={`project-${project.id}`} className={`project-study magazine-study ${media.length ? "magazine-study-with-media" : ""}`} aria-labelledby={`study-${project.id}`}>
    <header className="project-study-header"><span className="project-study-index">02.{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">{project.featured ? "Featured case study" : "Project case study"}</p><span className="project-study-category">{project.context}</span><h3 id={`study-${project.id}`} className="magazine-study-title"><Link href={`/projects/${project.id}`}>{project.title}</Link></h3></header>
    <div className="project-study-layout responsive-split">
      <div className="project-study-visual">
        <div className="visual-folio"><span>FIG. {String(index + 1).padStart(2, "0")}</span><span>{media.length ? "PROJECT MEDIA" : "INTERACTIVE DESIGN STUDY"}</span></div>
        {media.length ? <ProjectGallery media={media} title={project.title} /> : interactive ? <ProjectPlayground project={project} /> : <ProjectVisual project={project} controls />}
        {!media.length && <p className="project-study-visual-note">{interactive ? "Interactive concept / Sample data" : "Concept overview"}</p>}
        {media.length > 0 && interactive && <details className="project-study-demo"><summary>Explore the interactive concept <span aria-hidden="true">+</span></summary><ProjectPlayground project={project} /></details>}
        <div className="project-spec-panel"><p className="eyebrow">Specification / Project record</p><dl className="project-spec-list"><div><dt>Record</dt><dd>02.{String(index + 1).padStart(2, "0")}</dd></div><div><dt>Category</dt><dd>{project.context}</dd></div><div><dt>Role</dt><dd>{project.team ? "Project contributor / Team" : "Independent developer"}</dd></div><div><dt>Focus</dt><dd>{project.detail[0] || project.summary}</dd></div></dl></div>
        <div className="project-spec-panel"><p className="eyebrow">Technology / Stack</p><ul className="project-spec-stack">{project.stack.map(item => <li key={item}>{item}</li>)}</ul></div>
        {!!story?.architecture.length && <details className="project-spec-panel project-architecture-panel"><summary>System / Architecture <span aria-hidden="true">+</span></summary><ol>{story.architecture.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></details>}
      </div>
      <div className="project-study-copy">
        <p className="project-overview-label eyebrow">Overview / Project description</p>
        <p className="project-study-summary">{project.summary}</p>
        <div className="project-study-chapters">
          <section><h4><span>01</span>The problem</h4><p>{story?.problem || project.summary}</p></section>
          <section><h4><span>02</span>{project.team ? "My contribution" : "The implementation"}</h4><ul>{project.detail.slice(0, 2).map(point => <li key={point}>{point}</li>)}</ul></section>
          {(story?.decisions || story?.approach) && <section><h4><span>03</span>The decision</h4><p>{story.decisions || story.approach}</p></section>}
          {story?.outcome && <section><h4><span>04</span>The result</h4><p>{story.outcome}</p></section>}
        </div>
        <div className="project-study-links project-action-buttons"><Link href={`/projects/${project.id}`}>Read the full case study <ArrowUpRight size={16} /></Link>{!!story?.architecture.length && <Link href={`/projects/${project.id}#architecture`}>System architecture <ArrowUpRight size={14} /></Link>}{project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live project <ArrowUpRight size={14} /></a>}{project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={14} /></a>}</div>
      </div>
    </div>
  </article>;
}

export default function Work({ projects }: { projects: Project[] }) {
  const ordered = [...projects.filter(project => project.featured), ...projects.filter(project => !project.featured)];
  return <section id="work" className="section" style={{ "--section-accent": "var(--c-violet)" } as React.CSSProperties}>
    <div className="wrap">
      <SectionHeading index="02" eyebrow="Selected work / Project archive" title="Ideas, brought to life." description="A closer look at the problem, my contribution and the decisions behind each project." />
      {process.env.NODE_ENV !== "production" && <Link href="/admin" className="btn btn-ghost btn-sm project-editor-link"><Plus size={15} />Edit projects & media</Link>}
      <ScrollSequence />
      <div id="work-projects" className="work-project-list"><div className="project-archive-label"><span>PROJECT ARCHIVE</span><span>{String(ordered.length).padStart(2, "0")} STUDIES / SCROLL TO EXPLORE</span></div>{ordered.map((project, index) => <Reveal key={project.id}><ProjectCaseStudy project={project} index={index} /></Reveal>)}</div>
    </div>
  </section>;
}
