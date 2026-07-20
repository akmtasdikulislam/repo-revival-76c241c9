import { createFileRoute } from "@tanstack/react-router";
import { EventPage } from "@/components/carnival/EventPage";
import { Wizard } from "@/components/carnival/registration/WizardShell";
import { ctfConfig } from "@/components/carnival/registration/events/ctf.config";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/ctf")({
  head: () => ({
    meta: buildMeta({
      title: "CTF Championship — BUP CSE Tech Carnival 2.0",
      description:
        "Capture The Flag across pwn, crypto, web, reversing and forensics at BUP CSE Tech Carnival 2.0.",
    }),
  }),
  component: CTF,
});

function CTF() {
  return (
    <EventPage
      hero={{
        background: "linear-gradient(135deg,#e9ad00 0%,#f7cb38 48%,#d99b00 100%)",
        foreground: "#06183d",
        extraHeroClass: "ctf-hero",
        tag: "Registration Opens Soon",
        title: "CTF Championship",
        sub: "Capture The Flag",
        desc: "Pwn, crypto, web, reversing and forensics. Break it, decode it, prove it — every flag is a proof of exploit.",
        meta: [
          { num: "1–4", label: "Team size" },
          { num: "8 hrs", label: "Duration" },
          { num: "Jeopardy", label: "Format" },
        ],
        reporting: "Reporting 10:00 AM",
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
          <li>
            Jeopardy-style CTF across pwn, crypto, web exploitation, reverse engineering, forensics &amp;
            steganography.
          </li>
          <li>Teams of 1 to 4 members — solo hackers welcome.</li>
          <li>Challenge platform &amp; scoring rules shared with registered teams before the event.</li>
          <li>Leaderboard updates live throughout the contest window.</li>
        </ul>
      </section>

      <section className="section alt" id="register-section">
        <div className="sec-hdr">
          <span className="sec-num">// register --event=ctf</span>
          <h2 className="sec-title">
            Register your <em>team</em>
          </h2>
          <p className="sec-sub">At least 1 member required — add up to 4.</p>
        </div>
        <Wizard cfg={ctfConfig} />
      </section>
    </EventPage>
  );
}
