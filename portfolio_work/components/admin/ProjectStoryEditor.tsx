"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUp, Trash2, Upload } from "lucide-react";
import type { Project, ProjectMedia } from "@/lib/data";

type Story = NonNullable<Project["caseStudy"]>;
const emptyStory: Story = { problem: "", approach: "", architecture: [], decisions: "", lessons: "", outcome: "" };
const fields: { key: Exclude<keyof Story, "architecture">; label: string; hint: string }[] = [
  { key: "problem", label: "The problem", hint: "Who was this for, and what problem did it solve?" },
  { key: "approach", label: "The approach", hint: "How did the solution work?" },
  { key: "decisions", label: "Difficult decisions & trade-offs", hint: "What alternatives did you consider? Why did you choose this approach?" },
  { key: "lessons", label: "Lessons learned", hint: "What did you learn, and what would you change next time?" },
  { key: "outcome", label: "Outcome / measured results", hint: "Describe the real result. Only include numbers you can verify." },
];

export default function ProjectStoryEditor({ project, id, onChange }: {
  project: Pick<Project, "media" | "caseStudy">;
  id: string;
  onChange: (patch: Partial<Project>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const story = project.caseStudy ?? emptyStory;
  const media = project.media ?? [];
  const updateStory = (patch: Partial<Story>) => onChange({ caseStudy: { ...story, ...patch } });

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    if (files.length + media.length > 12) { setError("Use up to 12 media files per project."); return; }
    setUploading(true);
    setError("");
    const added: ProjectMedia[] = [];
    try {
      for (const file of Array.from(files)) {
        const res = await fetch("/api/project-media", { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
        const data = await res.json();
        if (!res.ok) throw new Error(`${file.name}: ${data.error || "Upload failed."}`);
        added.push({ ...data, caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      if (added.length) onChange({ media: [...media, ...added] });
      setUploading(false);
    }
  }

  return (
    <fieldset disabled={uploading} className="space-y-5 border-t pt-5" style={{ borderColor: "var(--border)" }}>
      <legend className="h3 px-1">Project media & case study</legend>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>Upload actual screenshots, machine photos or a walkthrough video. The first file is the showcase cover. Save the project after uploading.</p>
      <div>
        <label htmlFor={`${id}-upload`} className="label flex items-center gap-2"><Upload size={15} />Add screenshots / photos / video</label>
        <input id={`${id}-upload`} type="file" multiple accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" className="field" onChange={event => { void upload(event.target.files); event.target.value = ""; }} />
        <p className="mt-2 text-xs" style={{ color: "var(--text-3)" }}>PNG, JPG, WebP up to 15 MB · MP4, WebM up to 50 MB · 12 files per project.</p>
      </div>
      <p role="status" className="text-sm">{uploading ? "Uploading media…" : ""}</p>
      {error && <p role="alert" className="text-sm" style={{ color: "var(--c-rose)" }}>{error}</p>}
      <div className="space-y-4">{media.map((item, index) => <div key={`${item.src}-${index}`} className="card p-3">
        <div className="relative mb-3 overflow-hidden rounded" style={{ aspectRatio: "16 / 9", background: "var(--bg-subtle)" }}>
          {item.kind === "image" ? <Image src={item.src} alt={item.caption || "Project media preview"} fill sizes="600px" className="object-contain" /> : <video src={item.src} controls preload="metadata" className="h-full w-full" />}
        </div>
        <label className="label" htmlFor={`${id}-caption-${index}`}>{index === 0 ? "Cover image / video caption" : "Caption / image description"}</label>
        <input id={`${id}-caption-${index}`} value={item.caption} className="field" onChange={event => onChange({ media: media.map((m, n) => n === index ? { ...m, caption: event.target.value } : m) })} />
        <div className="mt-3 flex flex-wrap gap-2">
          {index > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({ media: [item, ...media.filter((_, n) => n !== index)] })}><ArrowUp size={14} />Use as cover</button>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({ media: media.filter((_, n) => n !== index) })}><Trash2 size={14} />Remove from project</button>
        </div>
      </div>)}</div>
      {fields.map(field => <div key={field.key}>
        <label htmlFor={`${id}-${field.key}`} className="label">{field.label}</label>
        <textarea id={`${id}-${field.key}`} className="field" rows={4} value={story[field.key]} placeholder={field.hint} onChange={event => updateStory({ [field.key]: event.target.value })} />
      </div>)}
      <div><label htmlFor={`${id}-architecture`} className="label">Architecture / workflow — one component or step per line</label><textarea id={`${id}-architecture`} className="field" rows={5} value={story.architecture.join("\n")} placeholder="React — interface and user interactions" onChange={event => updateStory({ architecture: event.target.value.split("\n") })} /></div>
      <p className="text-xs" style={{ color: "var(--text-3)" }}>Empty sections stay hidden on the public page. Media files are stored in public/projects; commit them with content/projects.json when publishing. Removing an item here keeps the original file on disk.</p>
    </fieldset>
  );
}
