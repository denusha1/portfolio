import Image from "next/image";
import { ArrowRight, Code2, Cpu, FileText, GitBranch } from "lucide-react";
import type { Project } from "@/lib/data";

/** Uploaded assets are real project media; empty states are labelled diagrams. */
export default function ProjectVisual({ project, controls = false }: { project: Project; controls?: boolean }) {
  const media = project.media?.[0];
  const hardware = project.id === "cnc";
  return (
    <div className={`project-visual ${hardware ? "project-visual-hardware" : ""}`}>
      {!hardware && <div className="project-browser" aria-hidden="true"><span /><span /><span /><p>{project.title}</p></div>}
      {media ? (
        <div className="project-media">
          {media.kind === "image" ? (
            <Image src={media.src} alt={media.caption || project.title} fill sizes="(max-width: 767px) 90vw, 1000px" className="object-contain" />
          ) : (
            <video src={media.src} controls={controls} muted playsInline preload="metadata" aria-label={media.caption || project.title} />
          )}
          {media.kind === "video" && !controls && <span className="project-media-label">Video walkthrough · Open case study</span>}
        </div>
      ) : (
        <div className="project-concept">
          <span className="project-concept-label">{hardware ? "System overview" : "Workflow overview"}</span>
          {project.id === "pms" ? (
            <><GitBranch size={32} strokeWidth={1.2} /><strong>Every evaluation.<br />A clear next step.</strong><div className="project-flow"><span>Evaluate</span><ArrowRight size={14} /><span>Review</span><ArrowRight size={14} /><span>Approve</span></div></>
          ) : project.id === "blogapp" ? (
            <><FileText size={32} strokeWidth={1.2} /><strong>From a first draft<br />to a published idea.</strong><div className="project-flow"><span>Write</span><ArrowRight size={14} /><span>Preview</span><ArrowRight size={14} /><span>Publish</span></div></>
          ) : hardware ? (
            <><Cpu size={32} strokeWidth={1.2} /><svg viewBox="0 0 340 105" className="project-machine" aria-label="Conceptual cutting path" role="img"><rect x="35" y="15" width="270" height="75" rx="4" /><path d="M60 75V35h85v40h80V35h55" strokeDasharray="5 5" /><path d="M183 8v89M35 23h270" /><circle cx="183" cy="23" r="7" /></svg><div className="project-flow"><span>G-code</span><ArrowRight size={14} /><span>Control</span><ArrowRight size={14} /><span>Cut</span></div></>
          ) : (
            <><Code2 size={36} strokeWidth={1.2} /><strong>{project.title}</strong><p>{project.stack.slice(0, 3).join(" · ")}</p></>
          )}
          <span className="project-concept-footnote">Concept diagram · {hardware ? "not a machine photograph" : "not an application screenshot"}</span>
        </div>
      )}
    </div>
  );
}
