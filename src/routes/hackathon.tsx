import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/carnival/SiteLayout";
import { HackathonRegistration } from "@/components/carnival/HackathonRegistration";
import { CountdownBar } from "@/components/carnival/CountdownBar";

export const Route = createFileRoute("/hackathon")({
  head: () => ({
    meta: [
      { title: "Hackathon — BUP CSE Tech Carnival 2.0" },
      {
        name: "description",
        content:
          "24-hour build sprint at BUP CSE Tech Carnival 2.0. Design, build and pitch a working prototype.",
      },
      { property: "og:title", content: "Hackathon — BUP CSE Tech Carnival 2.0" },
      { property: "og:description", content: "24 hours. Build & pitch. Ship it." },
    ],
  }),
  component: Hackathon,
});

function Hackathon() {
  return (
    <SiteLayout>
      <section
        className="event-hero hackathon-hero"
        style={{
          ["--ev-bg" as any]:
            "linear-gradient(135deg,#04172c 0%,#073a46 52%,#08243d 100%)",
          ["--ev-fg" as any]: "#eefcff",
        }}
      >
        <div className="event-hero-inner">
          <span className="tc-status">Registration Opens Soon</span>
          <h1 className="event-title">Hackathon</h1>
          <p className="event-sub">24-Hour Build Sprint</p>
          <p className="event-desc">
            Design, build and pitch something real. Teams of up to four ship a working prototype and
            defend it in front of industry judges.
          </p>
          <div className="event-meta">
            <div>
              <span className="em-num">up to 4</span>
              <span className="em-label">Team size</span>
            </div>
            <div>
              <span className="em-num">24 hrs</span>
              <span className="em-label">Duration</span>
            </div>
            <div>
              <span className="em-num">Build &amp; pitch</span>
              <span className="em-label">Format</span>
            </div>
          </div>
          <CountdownBar reporting="Reporting 08:00 AM" />
        </div>
      </section>





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
        <HackathonRegistration />
      </section>
    </SiteLayout>
  );
}
