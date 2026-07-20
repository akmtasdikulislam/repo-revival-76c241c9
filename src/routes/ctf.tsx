import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/carnival/SiteLayout";
import { CtfRegistration } from "@/components/carnival/CtfRegistration";
import { CountdownBar } from "@/components/carnival/CountdownBar";

export const Route = createFileRoute("/ctf")({
  head: () => ({
    meta: [
      { title: "CTF Championship — BUP CSE Tech Carnival 2.0" },
      {
        name: "description",
        content:
          "Capture The Flag across pwn, crypto, web, reversing and forensics at BUP CSE Tech Carnival 2.0.",
      },
      { property: "og:title", content: "CTF Championship — BUP CSE Tech Carnival 2.0" },
      { property: "og:description", content: "Break it, decode it, prove it. Jeopardy-style CTF." },
    ],
  }),
  component: CTF,
});

function CTF() {
  return (
    <SiteLayout>
      <section
        className="event-hero ctf-hero"
        style={{
          ["--ev-bg" as any]:
            "linear-gradient(135deg,#e9ad00 0%,#f7cb38 48%,#d99b00 100%)",
          ["--ev-fg" as any]: "#06183d",
        }}
      >
        <div className="event-hero-inner">
          <span className="tc-status">Registration Opens Soon</span>
          <h1 className="event-title">CTF Championship</h1>
          <p className="event-sub">Capture The Flag</p>
          <p className="event-desc">
            Pwn, crypto, web, reversing and forensics. Break it, decode it, prove it — every flag is a
            proof of exploit.
          </p>
          <div className="event-meta">
            <div>
              <span className="em-num">1–4</span>
              <span className="em-label">Team size</span>
            </div>
            <div>
              <span className="em-num">8 hrs</span>
              <span className="em-label">Duration</span>
            </div>
            <div>
              <span className="em-num">Jeopardy</span>
              <span className="em-label">Format</span>
            </div>
          </div>
          <CountdownBar reporting="Reporting 10:00 AM" />
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
        <CtfRegistration />
      </section>
    </SiteLayout>
  );
}
