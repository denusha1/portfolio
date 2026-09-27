import CinematicIntro from "@/components/CinematicIntro";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import ExperienceArchive from "@/components/ExperienceArchive";
import Education from "@/components/Education";
import Personal from "@/components/Personal";
import ChapterLink from "@/components/ChapterLink";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { getEducation, getProfile, getProjects, getSkills } from "@/lib/content";

export default async function Home() {
  // Fetched here and passed down, rather than each section importing content
  // directly: the sections are mostly client components and only a server
  // component can await the database. One place also means one round of
  // queries per render instead of four scattered ones.
  const [profile, projects, skills, education] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getEducation(),
  ]);

  return (
    <CinematicIntro name={profile.shortName}>
      <div className="portfolio-shell">
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero personalInfo={profile} />
        <About personalInfo={profile} />
        <ChapterLink href="#work" index="02" title="See the thinking in practice" />
        <Work projects={projects} />
        <ChapterLink href="#skills" index="03" title="Explore the tools behind the work" />
        <Skills skills={skills} projects={projects} />
        <ExperienceArchive />
        <Education education={education} />
        <ChapterLink href="#personal" index="06" title="Meet the person beyond the projects" />
        <Personal personalInfo={profile} />
        <ChapterLink href="#contact" index="07" title="Start a conversation" />
        <Contact personalInfo={profile} />
      </main>
      <Footer personalInfo={profile} />
      </div>
    </CinematicIntro>
  );
}
