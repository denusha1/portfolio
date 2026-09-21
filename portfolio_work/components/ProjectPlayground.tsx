"use client";

import { useId, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import type { Project } from "@/lib/data";

const stages = ["Draft", "In review", "Approved"] as const;
const initialTeam = [
  { name: "Alex Morgan", role: "Engineering", stage: 1 },
  { name: "Sam Taylor", role: "Design", stage: 0 },
  { name: "Jamie Lee", role: "Engineering", stage: 2 },
];

function EvaluationDemo() {
  const [team, setTeam] = useState(initialTeam);
  const [filter, setFilter] = useState("All");
  const [announcement, setAnnouncement] = useState("Choose a status or move an evaluation forward.");
  return <>
    <div className="playground-heading"><div><span className="eyebrow">My team</span><h4>A clear next step.</h4></div><button type="button" className="playground-reset" aria-label="Reset evaluation demo" onClick={() => { setTeam(initialTeam); setFilter("All"); setAnnouncement("Demo reset."); }}><RotateCcw size={15} /></button></div>
    <div className="playground-filters" aria-label="Filter evaluation status">{["All", ...stages].map(status => <button type="button" key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status}<span>{status === "All" ? team.length : team.filter(person => stages[person.stage] === status).length}</span></button>)}</div>
    <div className="playground-team">{team.filter(person => filter === "All" || stages[person.stage] === filter).map(person => <div className="playground-person" key={person.name}><span className="playground-initials" aria-hidden="true">{person.name.split(" ").map(word => word[0]).join("")}</span><div><strong>{person.name}</strong><small>{person.role} · {stages[person.stage]}</small></div><button type="button" disabled={person.stage === 2} aria-label={`${person.stage === 0 ? "Submit" : "Approve"} ${person.name}'s evaluation`} onClick={() => { setTeam(current => current.map(item => item.name === person.name ? { ...item, stage: item.stage + 1 } : item)); setAnnouncement(`${person.name}: ${stages[person.stage + 1]}.`); }}>{person.stage === 0 ? "Submit" : person.stage === 1 ? "Approve" : "Done"}{person.stage < 2 && <ArrowRight size={12} />}</button></div>)}{!team.some(person => filter === "All" || stages[person.stage] === filter) && <p className="playground-empty">All clear. No evaluations in this status.</p>}</div>
    <p className="playground-status" role="status">{announcement}</p>
  </>;
}

const starter = "# A little idea\nGreat things start with a first draft.\n\n## What I’m learning\nBuild. Experiment. Make it better.";
function WritingDemo() {
  const [draft, setDraft] = useState(starter);
  const [preview, setPreview] = useState(false);
  const id = useId();
  return <>
    <div className="playground-heading"><div><span className="eyebrow">The writing room</span><h4>Make an idea your own.</h4></div><button type="button" className="playground-reset" aria-label="Reset writing demo" onClick={() => { setDraft(starter); setPreview(false); }}><RotateCcw size={15} /></button></div>
    <div className="playground-filters"><button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>Write + preview</button><button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>Preview</button></div>
    {!preview && <><label htmlFor={id} className="sr-only">Try writing a draft. Use # or ## for headings.</label><textarea id={id} className="playground-editor playground-editor-live" value={draft} maxLength={1200} onChange={event => setDraft(event.target.value)} spellCheck placeholder="# Your next idea" /></>}
    <div className={`playground-paper ${preview ? "" : "playground-paper-live"}`} aria-label="Formatted draft preview">{draft.trim() ? draft.split("\n").map((line, index) => line.startsWith("## ") ? <h5 key={index}>{line.slice(3)}</h5> : line.startsWith("# ") ? <h4 key={index}>{line.slice(2)}</h4> : <p key={index}>{line || "\u00a0"}</p>) : <p>Your next idea starts here.</p>}</div>
    <p className="playground-status">{draft.trim() ? draft.trim().split(/\s+/).filter(word => !/^#+$/.test(word)).length : 0} words · Use # for headings. Your preview updates as you type.</p>
  </>;
}

const machineSteps = ["Load board", "Feed aligned", "Cutting path", "Cut complete"];
function CuttingDemo() {
  const [step, setStep] = useState(0);
  return <>
    <div className="playground-heading"><div><span className="eyebrow">From code to cut</span><h4>Follow the machine.</h4></div><button type="button" className="playground-reset" aria-label="Reset cutting demo" onClick={() => setStep(0)}><RotateCcw size={15} /></button></div>
    <svg className="playground-machine" viewBox="0 0 340 150" role="img" aria-label={`Cutting simulation: ${machineSteps[step]}`}><rect x="25" y="15" width="290" height="120" rx="10" fill="var(--bg)" stroke="var(--border-strong)" /><rect x="60" y={step === 0 ? 60 : 35} width="220" height="75" rx="3" fill="var(--accent-soft)" stroke="var(--c-violet)" /><path d="M85 90V55h75v35h85V55" fill="none" stroke="var(--c-violet)" strokeWidth="3" strokeDasharray="300" strokeDashoffset={step < 2 ? 300 : step === 2 ? 140 : 0} /><path d={`M${step < 2 ? 85 : step === 2 ? 160 : 245} 15v120`} stroke="var(--text-3)" /><circle cx={step < 2 ? 85 : step === 2 ? 160 : 245} cy={step < 2 ? 90 : step === 2 ? 90 : 55} r="6" fill="var(--c-violet)" /></svg>
    <div className="playground-machine-actions"><span role="status">0{step + 1} / 04 · {machineSteps[step]}</span><button type="button" onClick={() => setStep(current => (current + 1) % machineSteps.length)}>{step === 3 ? "Run again" : "Next step"}<ArrowRight size={14} /></button></div>
  </>;
}

export default function ProjectPlayground({ project }: { project: Project }) {
  return <div className="project-playground" role="group" aria-label={`${project.title} interactive playground`}>
    <div className="playground-topline"><span><Sparkles size={13} />Try it out</span><span>Interactive concept · Sample data</span></div>
    <div className="playground-content">{project.id === "pms" ? <EvaluationDemo /> : project.id === "blogapp" ? <WritingDemo /> : <CuttingDemo />}</div>
  </div>;
}
