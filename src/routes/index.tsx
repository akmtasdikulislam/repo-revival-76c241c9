import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Countdown } from "@/components/home/HeroCountdown";
import { Reveal } from "@/components/home/RevealOnScroll";
import { SponsorMarquee, SponsorShowcase } from "@/components/home/SponsorsMarquee";
import { ContactForm } from "@/components/home/ContactForm";
import { GALLERY_IMAGES } from "@/data/gallery";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({
      title: "BUP CSE Tech Carnival 2.0",
      description:
        "BUP CSE Tech Carnival 2.0 — IUPC, CTF Championship & Hackathon at Bangladesh University of Professionals. Three tracks. One weekend. Compile your ambition.",
    }),
  }),
  component: Home,
});


function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-[120px]"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(63,111,224,.18), transparent 40%), radial-gradient(circle at 85% 30%, rgba(53,208,224,.12), transparent 38%), var(--color-cn-bg)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-cn-strong) 1px, transparent 1px), linear-gradient(90deg, var(--color-cn-strong) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[820px] self-center overflow-hidden rounded-[14px] border border-cn-strong bg-[rgb(12_31_77_/_0.78)] shadow-glow-primary backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-cn-strong bg-[rgb(146_178_255_/_0.06)] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cn-coral" />
            <span className="h-2.5 w-2.5 rounded-full bg-cn-gold" />
            <span className="h-2.5 w-2.5 rounded-full bg-cn-mint" />
            <span className="ml-2.5 text-[11px] text-cn-ink-dimmer">bup@cse-carnival:~$</span>
          </div>
          <div className="px-7 pb-8 pt-7 text-center">
            <p className="mb-[22px] text-left text-xs text-cn-mint">
              <span className="text-cn-cyan">&gt;</span> booting BUP_CSE_TECH_CARNIVAL.exe ...
              <span className="cn-cursor text-cn-mint">▍</span>
            </p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
            >
              {[
                <p key="eb" className="eyebrow">
                  <span className="ping" />
                  Bangladesh University of Professionals — Dept. of CSE
                </p>,
                <h1 key="t" className="title">
                  <span className="line1">BUP CSE</span>
                  <span className="line2" data-text="TECH CARNIVAL">
                    TECH CARNIVAL
                  </span>
                  <span className="line3">2.0</span>
                </h1>,
                <p key="tg" className="mx-auto mt-[18px] max-w-[420px] text-sm text-cn-ink-dim">
                  Three tracks. One weekend. <em>Compile your ambition.</em>
                </p>,
              ].map((child, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {child}
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-9 flex flex-col items-center gap-[26px]">
              <Countdown />
              <div className="flex flex-wrap justify-center gap-3.5">
                <Link to="/" hash="tracks" className="btn-primary">
                  ./register --team=your_squad
                </Link>
                <Link to="/faq" className="btn-ghost">
                  cat faq.md
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SPONSOR MARQUEE */}
      <SponsorMarquee />

      {/* TRACKS / SEGMENT SHOWCASE */}
      <section className="section" id="tracks">
        <div className="section-header">
          <span className="section-eyebrow">// core_tracks[3]</span>
          <h2 className="section-title">
            Choose your <em>process</em>
          </h2>
          <p className="section-subtitle">Three independent competitions, each with its own registration.</p>
        </div>

        <Reveal>
          <div
            className="track-card"
            style={{ ["--countdown-bg" as any]: "#123a8c", ["--countdown-fg" as any]: "#eef2ff" }}
          >
            <div className="track-info">
              <div className="track-tag">
                <span className="countdown-number">01</span>
                <span className="event-status">Registration Opens Soon</span>
              </div>
              <h3 className="track-title">IUPC</h3>
              <p className="track-desc">
                Inter-University Programming Contest — a 5-hour ICPC-style algorithmic battle. Teams of
                three take on ranked problem sets under ACM rules.
              </p>
              <ul className="track-meta">
                <li>Team size: 3</li>
                <li>Duration: 5 hrs</li>
                <li>Format: ACM-ICPC</li>
              </ul>
              <Link to="/iupc" className="track-link">
                Explore &amp; register →
              </Link>
            </div>
            <div className="track-visual">
              <pre className="code-block"><span className="c-kw">for</span> (<span className="c-var">i</span> = <span className="c-num">0</span>; <span className="c-var">i</span> &lt; <span className="c-var">n</span>; <span className="c-var">i</span>++) {"{"}
  <span className="c-var">dp</span>[<span className="c-var">i</span>] = <span className="c-fn">max</span>(<span className="c-var">dp</span>[<span className="c-var">i</span>-<span className="c-num">1</span>], <span className="c-var">dp</span>[<span className="c-var">i</span>-<span className="c-num">2</span>] + <span className="c-var">a</span>[<span className="c-var">i</span>]);
{"}"}
<span className="c-cm">{"// Accepted · 0.04s"}</span></pre>
            </div>
          </div>
        </Reveal>


        <Reveal delay={0.1}>
          <div
            className="track-card"
            style={{ ["--countdown-bg" as any]: "var(--color-cn-cyber-red-bg)", ["--countdown-fg" as any]: "var(--color-cn-cyber-red-ink)" }}
          >
            <div className="track-info">
              <div className="track-tag">
                <span className="countdown-number">02</span>
                <span className="event-status">Registration Opens Soon</span>
              </div>
              <h3 className="track-title">
                CTF
                <br />
                Championship
              </h3>
              <p className="track-desc">
                Capture the Flag across pwn, crypto, web, reversing and forensics. Break it, decode it,
                prove it — every flag is a proof of exploit.
              </p>
              <ul className="track-meta">
                <li>Team size: 1–4</li>
                <li>Duration: 8 hrs</li>
                <li>Format: Jeopardy-style</li>
              </ul>
              <Link to="/ctf" className="track-link">
                Explore &amp; register →
              </Link>
            </div>
            <div className="track-visual">
              <pre className="code-block dark cyber-red"><span className="c-cm">$</span> nc chall.bupctf.io 1337
<span className="c-str">Welcome, agent. Find the flag.</span>
<span className="c-fn">strings</span> binary | <span className="c-fn">grep</span> <span className="c-str">flag{"{"}</span>
<span className="c-flag">flag{"{n0t_th3_r34l_0ne}"}</span></pre>
            </div>
          </div>
        </Reveal>


        <Reveal delay={0.2}>
          <div
            className="track-card"
            style={{ ["--countdown-bg" as any]: "#073a46", ["--countdown-fg" as any]: "#eef2ff" }}
          >
            <div className="track-info">
              <div className="track-tag">
                <span className="countdown-number">03</span>
                <span className="event-status">Registration Opens Soon</span>
              </div>
              <h3 className="track-title">Hackathon</h3>
              <p className="track-desc">
                24 hours to design, build and pitch something real. Teams of up to four ship a working
                prototype and defend it in front of industry judges.
              </p>
              <ul className="track-meta">
                <li>Team size: up to 4</li>
                <li>Duration: 24 hrs</li>
                <li>Format: Build &amp; pitch</li>
              </ul>
              <Link to="/hackathon" className="track-link">
                Explore &amp; register →
              </Link>
            </div>
            <div className="track-visual">
              <pre className="code-block"><span className="c-var">const</span> idea = <span className="c-fn">prototype</span>(<span className="c-var">vision</span>);
<span className="c-fn">deploy</span>(idea);
<span className="c-cm">{"// git commit -m \"ship it\""}</span></pre>
            </div>
          </div>
        </Reveal>

      </section>

      {/* EVENT TIMELINE */}
      <section className="section alt" id="timeline">
        <div className="section-header">
          <span className="section-eyebrow">// event.log</span>
          <h2 className="section-title">
            Boot <em>sequence</em>
          </h2>
          <p className="section-subtitle">The road from registration to grand finale.</p>
        </div>
        <div className="log-list">
          {[
            ["T-minus 6w", "Registration Opens", "Team formation, portal live for all 3 tracks."],
            ["T-minus 3w", "Registration Closes", "Slot confirmation & payment deadline."],
            ["T-minus 1w", "Eligible List Published", "Selected teams announced on each event page."],
            ["Day 01", "Opening Ceremony + Contest Day 1", "IUPC & CTF begin."],
            ["Day 02", "Hackathon Finale + Closing", "Demos, judging, prize distribution."],
          ].map(([t, title, desc], i) => (
            <Reveal key={t} delay={i * 0.08} y={16}>
              <div className="log-row">
                <span className="log-time">{t}</span>
                <span className="log-dash" />
                <span className="log-title">{title}</span>
                <span className="log-desc">{desc}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EARLIER EVENTS / LEGACY */}
      <section className="section" id="legacy">
        <div className="section-header">
          <span className="section-eyebrow">// history --all</span>
          <h2 className="section-title">
            Building on the <em>first carnival</em>
          </h2>
          <p className="section-subtitle">
            Tech Carnival 2.0 grows out of BUP CSE's earlier programming and CTF events.
          </p>
        </div>
        <div className="legacy-grid">
          <div className="legacy-card">
            <span className="legacy-year">v1.0</span>
            <h4>BUP Tech Carnival</h4>
            <p>
              The first edition — a single-day programming contest that brought BUP's competitive
              programmers together.
            </p>
          </div>
          <div className="legacy-card">
            <span className="legacy-year">B14k_F14g</span>
            <h4>Campus CTF Nights</h4>
            <p>
              Informal capture-the-flag rounds run by the CTF community, the seed for this year's full
              CTF track.
            </p>
          </div>
          <div className="legacy-card">
            <span className="legacy-year">RunTimeTerror</span>
            <h4>Inter-Team Scrims</h4>
            <p>
              Regular practice contests among BUP's competitive programming squads, sharpening the
              talent Carnival 2.0 now showcases.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="section alt gallery-preview-section">
        <div className="section-header">
          <span className="section-eyebrow">// gallery --preview</span>
          <h2 className="section-title">
            Moments from <em>past editions</em>
          </h2>
          <p className="section-subtitle">Photos from previous programming contests and CTF nights.</p>
        </div>

        <div className="gallery-preview-grid">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.figure
              key={img.id}
              className={`gallery-preview-tile tile-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={img.src} alt={img.caption} loading="lazy" />
              <figcaption>
                <span className="gallery-preview-caption">{img.caption}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="gallery-preview-cta">
          <Link to="/gallery" className="btn-ghost">
            Open full gallery →
          </Link>
        </div>
      </section>

      {/* SPONSOR SHOWCASE */}
      <SponsorShowcase />

      {/* CONTACT */}
      <ContactForm />

      {/* SUPPORT / CTA */}
      <section className="cta-section cta-section-v2" id="register">
        <div className="cta-bg" aria-hidden="true">
          <span className="cta-orb cta-orb-1" />
          <span className="cta-orb cta-orb-2" />
          <span className="cta-grid" />
        </div>
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow center">
            <span className="ping" />
            Seats are limited
          </span>
          <h2 className="cta-title">
            Ready to <em>push --force</em>?
          </h2>
          <p className="cta-sub">
            Pick your track above and lock in a slot before registration closes.
          </p>
          <div className="cta-actions">
            <Link to="/" hash="tracks" className="btn-primary big">
              ./choose --track
              <IconArrowUpRight size={18} style={{ marginLeft: 8, verticalAlign: "-3px" }} />
            </Link>
            <Link to="/faq" className="btn-ghost big">
              cat faq.md
            </Link>
          </div>
          <ul className="cta-meta">
            <li><strong>3</strong><span>competition tracks</span></li>
            <li><strong>500৳</strong><span>per participant</span></li>
            <li><strong>48h</strong><span>reply on queries</span></li>
          </ul>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
