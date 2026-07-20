import { createFileRoute } from "@tanstack/react-router";
import { EventPage } from "@/components/event/EventPage";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { hackathonConfig } from "@/components/registration/events/hackathon.config";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/hackathon")({
  head: () => ({
    meta: buildMeta({
      title: "Hackathon — BUP CSE Tech Carnival 2.0",
      description:
        "24-hour build sprint at BUP CSE Tech Carnival 2.0. Design, build and pitch a working prototype.",
    }),
  }),
  component: Hackathon,
});

function Hackathon() {
  return (
    <EventPage
      hero={{
        background: "linear-gradient(135deg,#04172c 0%,#073a46 52%,#08243d 100%)",
        foreground: "#eefcff",
        extraHeroClass: "hackathon-hero",
        tag: "Registration Opens Soon",
        title: "Hackathon",
        sub: "24-Hour Build Sprint",
        desc: "Design, build and pitch something real. Teams of up to four ship a working prototype and defend it in front of industry judges.",
        meta: [
          { num: "up to 4", label: "Team size" },
          { num: "24 hrs", label: "Duration" },
          { num: "Build & pitch", label: "Format" },
        ],
        reporting: "Reporting 08:00 AM",
      }}
    >
      <section className="section">
        <div className="sec-hdr">
          <span className="sec-num">// rules.md</span>
          <h2 className="sec-title">
            What to <em>expect</em>
          </h2>
        </div>
        <ul className="rules-list">
          <li>24-hour build window from kickoff to submission deadline.</li>
          <li>Teams of 1 to 4 members — solo builders welcome.</li>
          <li>Working prototype required — polished pitch decks alone won't qualify.</li>
          <li>Judged on innovation, technical execution, and pitch clarity.</li>
        </ul>
      </section>

      <section className="section alt" id="register-section">
        <div className="sec-hdr">
          <span className="sec-num">// register --event=hackathon</span>
          <h2 className="sec-title">
            Register your <em>team</em>
          </h2>
          <p className="sec-sub">At least 1 member required — add up to 4.</p>
        </div>
        <RegistrationWizard cfg={hackathonConfig} />
      </section>
    </EventPage>
  );
}
