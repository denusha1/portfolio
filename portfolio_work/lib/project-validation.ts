import type { Project } from "./data";

export const STORY_FIELDS = ["problem", "approach", "decisions", "lessons", "outcome"] as const;
export function isWebUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}
export function isProjectMediaPath(value: unknown): value is string {
  return typeof value === "string" && /^\/projects\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp|mp4|webm)$/.test(value);
}
export function validateProjects(input: unknown): string[] {
  if (!Array.isArray(input)) return ["Payload must be an array of projects."];
  const errors: string[] = [];
  const ids = new Set<string>();
  input.forEach((raw, i) => {
    const where = `Project ${i + 1}`;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) { errors.push(`${where}: invalid project.`); return; }
    const p = raw as Project;
    for (const field of ["id", "title", "context", "summary"] as const) {
      if (typeof p[field] !== "string" || !p[field].trim()) errors.push(`${where}: ${field} is required.`);
    }
    if (typeof p.id === "string") {
      if (!/^[a-z0-9-]+$/.test(p.id)) errors.push(`${where}: id must contain lowercase letters, numbers and hyphens.`);
      if (ids.has(p.id)) errors.push(`${where}: duplicate id.`);
      ids.add(p.id);
    }
    for (const field of ["detail", "stack"] as const) {
      if (!Array.isArray(p[field]) || p[field].some(x => typeof x !== "string")) errors.push(`${where}: ${field} must be a list of strings.`);
    }
    if (!Array.isArray(p.stack) || !p.stack.length) errors.push(`${where}: add at least one technology.`);
    for (const field of ["repo", "live"] as const) {
      if (p[field] !== undefined && (typeof p[field] !== "string" || (p[field].trim() && !isWebUrl(p[field])))) errors.push(`${where}: ${field} must be an http or https URL.`);
    }
    if (p.media !== undefined) {
      if (!Array.isArray(p.media) || p.media.length > 12) errors.push(`${where}: use up to 12 media files.`);
      else for (const m of p.media) {
        if (!m || !isProjectMediaPath(m.src) || !["image", "video"].includes(m.kind) || typeof m.caption !== "string") errors.push(`${where}: invalid media entry.`);
        else if ((m.kind === "video") !== /\.(mp4|webm)$/.test(m.src)) errors.push(`${where}: media type does not match the file.`);
      }
    }
    if (p.caseStudy !== undefined) {
      if (!p.caseStudy || typeof p.caseStudy !== "object") errors.push(`${where}: invalid case study.`);
      else {
        for (const field of STORY_FIELDS) if (typeof p.caseStudy[field] !== "string") errors.push(`${where}: ${field} must be text.`);
        if (!Array.isArray(p.caseStudy.architecture) || p.caseStudy.architecture.some(x => typeof x !== "string")) errors.push(`${where}: architecture must be a list of steps.`);
      }
    }
  });
  if (input.length && input.filter(p => p?.featured).length !== 1) errors.push("Choose exactly one featured project.");
  return errors;
}
