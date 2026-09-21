import type { Project } from "@/lib/data";

export default function BuildStory({ project }: { project: Project }) {
  const story = project.caseStudy;
  const chapters = [
    { label: "The problem", text: story?.problem || project.summary },
    { label: "My contribution", text: project.detail.join(" ") },
    { label: "The decision", text: story?.decisions || story?.approach },
    { label: "The result", text: story?.outcome },
  ].filter(chapter => chapter.text);
  return <details className="build-story">
    <summary><span>Behind the build</span><span className="build-story-plus" aria-hidden="true">+</span></summary>
    <p className="build-story-intro">The problem. The choices. The work behind the screen.</p>
    <ol>{chapters.map((chapter, index) => <li key={chapter.label}><span className="build-story-number">0{index + 1}</span><div><h4>{chapter.label}</h4><p>{chapter.text}</p></div></li>)}</ol>
  </details>;
}
