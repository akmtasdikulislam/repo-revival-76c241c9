import { motion } from "framer-motion";
import { SPONSORS, sponsorLogo } from "@/data/sponsors";

export function SponsorMarquee() {
  const EVENT_LABEL = "Walton Presents BUP CSE Tech Carnival 2.0";
  const loop = [...SPONSORS, ...SPONSORS];
  return (
    <section className="sponsor-marquee" aria-label="Event sponsors">
      <div className="sponsor-marquee-viewport">
        <motion.div
          className="sponsor-marquee-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          style={{ animation: "none" }}
        >
          {[0, 1].map((rep) => (
            <div key={`grp-${rep}`} className="sponsor-marquee-group">
              <span className="sponsor-marquee-event" aria-hidden={rep === 1}>
                ★ {EVENT_LABEL}
              </span>
              {SPONSORS.map((s, i) => (
                <a
                  key={`${rep}-${s.name}-${i}`}
                  href={`https://${s.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-marquee-item"
                  title={s.name}
                >
                  <img
                    src={sponsorLogo(s.domain)}
                    alt={`${s.name} logo`}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          ))}
          {/* keep original flat loop hidden for backwards-compat; not needed */}
          {false && loop.length}
        </motion.div>
      </div>
    </section>
  );
}

export function SponsorShowcase() {
  const title = SPONSORS[0];
  const rest = SPONSORS.slice(1);
  return (
    <section className="section sponsor-showcase-section" id="sponsors">
      <div className="sec-hdr">
        <span className="sec-num">// powered.by.partners</span>
        <h2 className="sec-title">
          Sponsors &amp; <em>partners</em>
        </h2>
        <p className="sec-sub">Together, we make the carnival possible.</p>
      </div>

      <motion.a
        className="title-sponsor-card"
        href={`https://${title.domain}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sponsor-tier-badge">{title.tier}</span>
        <span className="title-sponsor-logo-panel">
          <img src={sponsorLogo(title.domain, 400)} alt={`${title.name} logo`} />
        </span>
        <span className="title-sponsor-bottom">
          <span>
            <strong>{title.name}</strong>
            <small>{title.tagline}</small>
          </span>
          <span className="sponsor-link-arrow" aria-hidden="true">↗</span>
        </span>
      </motion.a>

      <div className="co-sponsor-heading">
        <span>Co-sponsors &amp; partners</span>
        <span className="co-sponsor-line" />
      </div>

      <div className="co-sponsor-grid">
        {rest.map((s, i) => (
          <motion.a
            key={s.name}
            className="co-sponsor-card"
            href={`https://${s.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {s.tier && <span className="co-sponsor-tier">{s.tier}</span>}
            <span className="co-sponsor-logo-panel">
              <img
                src={sponsorLogo(s.domain)}
                alt={`${s.name} logo`}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              
            </span>
            <span className="co-sponsor-meta">
              <strong>{s.name}</strong>
              {s.tagline && <small>{s.tagline}</small>}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
