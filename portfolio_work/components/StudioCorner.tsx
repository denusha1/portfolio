"use client";

import OutlineWord from "./OutlineWord";
import { goToSection } from "@/lib/nav";
import { useState } from "react";
import { deskTools, developmentNotes, nowItems, storyPanels } from "@/content/studio-notes";

export default function StudioCorner() {
  const [tool, setTool] = useState(0);
  return <div className="studio-corner">
    <div className="corner-heading"><div><p className="eyebrow">Away from the project cards</p><h3>A little more me.</h3></div><span className="corner-handwritten">Always a work in progress ↙</span></div>
    <div className="personal-story-intro"><OutlineWord>CURIOUS</OutlineWord><p>About the work. And the curiosity behind it.</p></div>
    <div className="personal-story-grid">{storyPanels.map(panel => <section key={panel.label}><p className="eyebrow">{panel.label}</p><h4>{panel.title}</h4><p>{panel.text}</p><a href={panel.href} onClick={event => { event.preventDefault(); goToSection(panel.href); }}>{panel.link} ↗</a></section>)}</div>
    <div className="corner-layout">
      <section className="now-corner" aria-labelledby="now-title">
        <p className="eyebrow"><span className="now-dot" aria-hidden="true" />The now corner</p><h4 id="now-title">On my mind. On my desk.</h4>
        {nowItems.map(item => <div className="now-item" key={item.label}><span>{item.label}</span><h5>{item.title}</h5><p>{item.detail}</p></div>)}
      </section>
      <section className="tools-corner" aria-labelledby="tools-title"><p className="eyebrow">My tools shelf</p><h4 id="tools-title">Little tools. Lots of possibilities.</h4><p className="corner-description">Pick a tool to take a closer look.</p>
        <div className="tools-shelf" role="group" aria-label="Explore tools">{deskTools.map((item, index) => <button key={item.name} type="button" aria-pressed={tool === index} onClick={() => setTool(index)}><span aria-hidden="true">{item.mark}</span><small>{item.name}</small></button>)}</div>
        <div className="tool-description" role="status"><strong>{deskTools[tool].name}</strong><p>{deskTools[tool].use}</p></div>
      </section>
    </div>
    <div className="notes-heading"><p className="eyebrow">Notes from the desk</p><p>Little reminders for building better. Tap to unfold.</p></div>
    <div className="desk-notes">{developmentNotes.map((note, index) => <details className={`desk-note desk-note-${index}`} key={note.title}><summary><span className="note-pin" aria-hidden="true" /><small>{note.teaser}</small><strong>{note.title}</strong><span className="note-toggle" aria-hidden="true">↗</span></summary><p>{note.detail}</p></details>)}</div>
  </div>;
}
