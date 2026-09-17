import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/content";
import ProjectVisual from "@/components/ProjectVisual";
import ThemeToggle from "@/components/ThemeToggle";

const readProjects = cache(getProjects);
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await readProjects()).find(item => item.id === slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.id}`, type: "article" },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await readProjects();
  const index = projects.findIndex(item => item.id === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const story = project.caseStudy;
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "contribution", label: project.team ? "My contribution" : "Implementation" },
    ...(story?.architecture.length ? [{ id: "architecture", label: "Architecture" }] : []),
    ...(project.media?.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(story?.decisions ? [{ id: "decisions", label: "Decisions" }] : []),
    ...(story?.lessons ? [{ id: "lessons", label: "Lessons" }] : []),
    ...(story?.outcome ? [{ id: "outcome", label: "Outcome" }] : []),
  ];
  return (
    <>
      <header className="case-header"><div className="wrap flex items-center justify-between gap-4"><Link href="/#work" className="case-back"><ArrowLeft size={16} />All projects</Link><ThemeToggle /></div></header>
      <main id="main" className="wrap case-page">
        <div className="case-intro"><p className="eyebrow">Project study / {project.context}</p><h1>{project.title}</h1><p className="lede">{project.summary}</p><div className="showcase-links">
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Live demo <ArrowUpRight size={16} /></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View source <ArrowUpRight size={16} /></a>}
        </div></div>
        <ProjectVisual project={project} controls />
        <div className="case-layout">
          <aside className="case-sidebar"><nav aria-label="Case study contents"><p className="eyebrow">In this study</p>{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav><p className="eyebrow mt-8">Built with</p><ul className="showcase-stack">{project.stack.map(item => <li className="tag" key={item}>{item}</li>)}</ul></aside>
          <div className="case-body">
            <section id="overview"><p className="eyebrow">01 / The context</p><h2>The problem & approach</h2><p>{story?.problem || project.summary}</p>{story?.approach && <p>{story.approach}</p>}</section>
            <section id="contribution"><p className="eyebrow">02 / Ownership</p><h2>{project.team ? "My part in the bigger picture" : "Inside the implementation"}</h2>{project.team && <p>This was a team project. The work below describes my contribution.</p>}<ul className="case-contributions">{project.detail.map((point, i) => <li key={point}><span>{String(i + 1).padStart(2, "0")}</span><p>{point}</p></li>)}</ul></section>
            {!!story?.architecture.length && <section id="architecture"><p className="eyebrow">System design</p><h2>How the pieces connect</h2><p>A high-level view of the project’s main components.</p><ol className="case-architecture">{story.architecture.map((step, i) => <li key={`${i}-${step}`}><span className="case-node">{String(i + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section>}
            {!!project.media?.length && <section id="gallery"><p className="eyebrow">A closer look</p><h2>Inside the project</h2><div className="case-gallery">{project.media.map((media, i) => <figure key={`${media.src}-${i}`}>
              {media.kind === "video" ? <video src={media.src} controls playsInline preload="metadata" aria-label={media.caption || `${project.title} walkthrough`} /> : <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${media.caption || project.title}`}><Image src={media.src} alt={media.caption || `${project.title} screenshot ${i + 1}`} width={1600} height={1000} sizes="(max-width: 767px) 90vw, 760px" /></a>}
              {media.caption && <figcaption>{media.caption}</figcaption>}
            </figure>)}</div></section>}
            {story?.decisions && <section id="decisions"><p className="eyebrow">Trade-offs</p><h2>Decisions that shaped the work</h2><p className="whitespace-pre-line">{story.decisions}</p></section>}
            {story?.lessons && <section id="lessons"><p className="eyebrow">Reflection</p><h2>What I learned</h2><p className="whitespace-pre-line">{story.lessons}</p></section>}
            {story?.outcome && <section id="outcome"><p className="eyebrow">The result</p><h2>What came out of it</h2><p className="whitespace-pre-line">{story.outcome}</p></section>}
          </div>
        </div>
        <div className="case-next"><Link href="/#work" className="case-back"><ArrowLeft size={16} />Back to all projects</Link>{next && <Link href={`/projects/${next.id}`}><span className="eyebrow">Next project</span><strong>{next.title} <ArrowRight size={20} /></strong></Link>}</div>
      </main>
    </>
  );
}
