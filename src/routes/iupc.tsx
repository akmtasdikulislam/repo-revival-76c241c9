import { createFileRoute } from "@tanstack/react-router";
import { EventPage } from "@/components/event/EventPage";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { iupcConfig } from "@/components/registration/events/iupc.config";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/iupc")({
  head: () => ({
    meta: buildMeta({
      title: "IUPC — BUP CSE Tech Carnival 2.0",
      description:
        "Inter-University Programming Contest — a 5-hour ICPC-style algorithmic battle at BUP CSE Tech Carnival 2.0.",
    }),
  }),
  component: IUPC,
});

function IUPC() {
  return (
    <EventPage
      hero={{
        background: "#123a8c",
        foreground: "#eef2ff",
        tag: "Registration Opens Soon",
        title: "IUPC",
        sub: "Inter-University Programming Contest",
        desc: "A 5-hour ICPC-style algorithmic battle. Teams of three take on ranked problem sets under ACM rules — one machine, one scoreboard, zero mercy.",
        meta: [
          { num: "3", label: "Team size" },
          { num: "5 hrs", label: "Duration" },
          { num: "ACM", label: "Format" },
        ],
        reporting: "Reporting 09:00 AM",
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
        <RegistrationWizard cfg={iupcConfig} />
      </section>
    </EventPage>
  );
}
