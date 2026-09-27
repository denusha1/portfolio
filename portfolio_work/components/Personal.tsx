import type { Profile } from "@/lib/content";
import PhotoStory from "./PhotoStory";
import SectionHeading from "./SectionHeading";
import StudioCorner from "./StudioCorner";

export default function Personal({ personalInfo }: { personalInfo: Profile }) {
  return (
    <section id="personal" className="section personal-editorial" aria-label="Personal side">
      <div className="wrap">
        <SectionHeading index="06" eyebrow="Personal field notes" title="Beyond the build." description="The curiosity, habits and small discoveries that shape how I work." />
        <PhotoStory personalInfo={personalInfo} />
        <StudioCorner />
      </div>
    </section>
  );
}
