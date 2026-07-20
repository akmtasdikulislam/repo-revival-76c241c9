import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/carnival/SiteLayout";
import { IupcRegistration } from "@/components/carnival/IupcRegistration";
import { CountdownBar } from "@/components/carnival/CountdownBar";

export const Route = createFileRoute("/iupc")({
  head: () => ({
    meta: [
      { title: "IUPC — BUP CSE Tech Carnival 2.0" },
      {
        name: "description",
        content:
          "Inter-University Programming Contest — a 5-hour ICPC-style algorithmic battle at BUP CSE Tech Carnival 2.0.",
      },
      { property: "og:title", content: "IUPC — BUP CSE Tech Carnival 2.0" },
      { property: "og:description", content: "5 hours. Teams of three. ACM-ICPC format." },
    ],
  }),
  component: IUPC,
});

function IUPC() {
  return (
    <SiteLayout>
      <section
        className="event-hero"
        style={{ ["--ev-bg" as any]: "#123a8c", ["--ev-fg" as any]: "#eef2ff" }}
      >
        <div className="event-hero-inner">
          <span className="tc-status">Registration Opens Soon</span>
          <h1 className="event-title">IUPC</h1>
          <p className="event-sub">Inter-University Programming Contest</p>
          <p className="event-desc">
            A 5-hour ICPC-style algorithmic battle. Teams of three take on ranked problem sets under
            ACM rules — one machine, one scoreboard, zero mercy.
          </p>
          <div className="event-meta">
            <div>
              <span className="em-num">3</span>
              <span className="em-label">Team size</span>
            </div>
            <div>
              <span className="em-num">5 hrs</span>
              <span className="em-label">Duration</span>
            </div>
            <div>
              <span className="em-num">ACM</span>
              <span className="em-label">Format</span>
            </div>
          </div>
          <CountdownBar reporting="Reporting 09:00 AM" />
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
          <li>ICPC-style contest format — 5 hours of algorithmic problem solving.</li>
          <li>Teams of exactly 3 members, one shared machine per team on contest day.</li>
          <li>Platform &amp; environment details will be shared with selected teams before the contest.</li>
          <li>Cash prizes and recognition for the top-ranked teams.</li>
        </ul>
      </section>

      <section className="section alt" id="register-section">
        <div className="sec-hdr">
          <span className="sec-num">// register --event=iupc</span>
          <h2 className="sec-title">
            Register your <em>team</em>
          </h2>
          <p className="sec-sub">All 3 members are required for IUPC.</p>
        </div>
        <IupcRegistration />
      </section>
    </SiteLayout>
  );
}
