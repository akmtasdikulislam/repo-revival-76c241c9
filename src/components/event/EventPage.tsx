import type { CSSProperties, ReactNode } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CountdownBar } from "@/components/event/EventCountdownBar";

/**
 * Shared shell for /iupc, /ctf, /hackathon.
 * Renders the event hero (badge, title, sub, description, meta stats, countdown)
 * and yields the page body as children — DOM classes and structure are
 * identical to the pre-refactor bespoke sections.
 */
export type EventMeta = { num: ReactNode; label: string };

export type EventHero = {
  background: string;
  foreground: string;
  extraHeroClass?: string; // e.g. "ctf-hero", "hackathon-hero"
  tag?: string; // "Registration Opens Soon"
  title: string;
  sub: string;
  desc: string;
  meta: EventMeta[];
  reporting: string;
};

export function EventPage({ hero, children }: { hero: EventHero; children: ReactNode }) {
  const heroStyle = {
    ["--event-bg" as string]: hero.background,
    ["--event-fg" as string]: hero.foreground,
  } as CSSProperties;

  const heroClass = `event-hero${hero.extraHeroClass ? " " + hero.extraHeroClass : ""}`;

  return (
    <SiteLayout>
      <section className={heroClass} style={heroStyle}>
        <div className="event-hero-inner">
          {hero.tag && <span className="event-status">{hero.tag}</span>}
          <h1 className="event-title">{hero.title}</h1>
          <p className="event-sub">{hero.sub}</p>
          <p className="event-desc">{hero.desc}</p>
          <div className="event-meta">
            {hero.meta.map((m, i) => (
              <div key={i}>
                <span className="event-meta-number">{m.num}</span>
                <span className="event-meta-label">{m.label}</span>
              </div>
            ))}
          </div>
          <CountdownBar reporting={hero.reporting} />
        </div>
      </section>
      {children}
    </SiteLayout>
  );
}
