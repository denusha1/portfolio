import Image from "next/image";
import type { Profile } from "@/lib/content";

/** The original photograph is the record; the nearby cutout is a styled portrait. */
export default function PhotoStory({ personalInfo }: { personalInfo: Profile }) {
  return <section className="photo-story" aria-labelledby="photo-story-title">
    <div className="spread-folio"><span>PERSONAL ARCHIVE / 01</span><span>{personalInfo.location.toUpperCase()}</span></div>
    <div className="photo-story-grid responsive-split">
      <figure className="photo-story-figure"><a href="/profile.jpg" target="_blank" rel="noopener noreferrer" aria-label={`View the original photograph of ${personalInfo.name}`}><Image src="/profile.jpg" alt={`${personalInfo.name} at a University of Moratuwa event, wearing a peach blouse and blue lanyard`} fill sizes="(max-width: 899px) 92vw, 60vw" /></a><figcaption><span>FIG. 01 / {personalInfo.shortName}</span><span>Personal photograph ↗</span></figcaption></figure>
      <div className="photo-story-copy"><p className="eyebrow">The life around the work</p><h3 id="photo-story-title">Learning by building.<br />One project at a time.</h3><p>I’m studying at the {personalInfo.university}, bringing what I learn into web applications, team projects and hands-on experiments.</p><div className="photo-story-detail"><span>STUDY</span><p>{personalInfo.degree}</p></div><div className="photo-story-detail"><span>CURIOSITY</span><p>{personalInfo.interests.join(". ")}.</p></div></div>
    </div>
  </section>;
}
