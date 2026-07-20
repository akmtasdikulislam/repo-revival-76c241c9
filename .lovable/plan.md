# Naming Refactor Plan

Goal: give every file, folder, component, and CSS class a name that reads like a shipping product's — full words, consistent casing, no cryptic prefixes — while keeping the rendered UI, routes, and behavior byte-identical.

I audited the tree and grouped changes by risk. Anything that already reads well (routes `/iupc` `/ctf` `/hackathon`, `EventPage`, `SiteLayout`, `sslcommerz.functions.ts`, `lib/seo.ts`, event slugs) stays as-is.

---

## 1. Folder layout

The whole app IS the carnival site, so the `carnival/` namespace inside `components/` is redundant nesting. Flatten and group by role:

```text
src/components/
  layout/          ← SiteLayout, nav-items
  home/            ← Countdown, Sponsors, ContactForm, Reveal
  event/           ← EventPage, CountdownBar
  registration/    ← (unchanged path, contents renamed below)
  id-card/         ← IdCardUploader
```

- `src/components/carnival/RegistrationForm.tsx` — **delete** (dead code; only self-referenced).
- `src/lib/errors/` — group `error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts` under one folder (import paths updated).

## 2. Files & components

| Current | New | Reason |
|---|---|---|
| `components/carnival/nav-items.ts` | `components/layout/nav-items.ts` | kebab-case data module is fine; just relocated |
| `components/carnival/Countdown.tsx` | `components/home/HeroCountdown.tsx` | distinguishes it from `CountdownBar` |
| `components/carnival/CountdownBar.tsx` | `components/event/EventCountdownBar.tsx` | matches its sole caller (`EventPage`) |
| `components/carnival/Sponsors.tsx` | `components/home/SponsorsMarquee.tsx` | describes what it renders |
| `components/carnival/Reveal.tsx` | `components/home/RevealOnScroll.tsx` | intent-revealing |
| `components/carnival/ContactForm.tsx` | `components/home/ContactForm.tsx` | just relocated |
| `components/carnival/IdCardUploader.tsx` | `components/id-card/IdCardUploader.tsx` | relocated |
| `components/carnival/registration/WizardShell.tsx` (exports `Wizard`) | `registration/RegistrationWizard.tsx` (exports `RegistrationWizard`) | filename matches export |
| `registration/shared.tsx` | `registration/wizard-fields.tsx` | describes contents (Field, PhoneInput, InstitutionField, FeeBanner, SuccessPanel, SizeChart, SummaryAside) |
| `registration/steps.tsx` | `registration/wizard-steps.tsx` | mirrors the fields file |
| `registration/types.ts` | unchanged | already conventional |
| `registration/events/*.config.ts` | unchanged | already conventional |

All call sites (`routes/iupc.tsx`, `routes/ctf.tsx`, `routes/hackathon.tsx`, `routes/index.tsx`, `EventPage`, `SiteLayout`) get their imports rewritten in the same commit.

## 3. Route files

Routes stay at their current URLs. No route path changes — those are user-facing and SEO-relevant. Only the internal component names inside route files are aligned (`Wizard` → `RegistrationWizard`).

## 4. CSS class prefixes

Current cryptic prefixes get expanded to full words. Every rename is done by find-and-replace across `src/styles.css` **and** every `.tsx` that references the class — no orphaned selectors.

| Prefix | Rename to | Where used |
|---|---|---|
| `wiz-*` (30+ classes) | `wizard-*` | registration wizard |
| `reg-card`, `reg-success` | `registration-card`, `registration-success` | registration wizard |
| `sec-hdr`, `sec-num`, `sec-title`, `sec-sub` | `section-header`, `section-eyebrow`, `section-title`, `section-subtitle` | home + event pages |
| `em-num`, `em-label` | `event-meta-number`, `event-meta-label` | `EventPage` hero |
| `ev-bg`, `ev-fg` (CSS vars) | `--event-bg`, `--event-fg` | `EventPage` inline style |
| `tc-status`, `tc-bg`, `tc-fg`, `tc-num` | `event-status`, `countdown-bg`, `countdown-fg`, `countdown-number` | event hero + countdown bar |
| `cn-*` design tokens (`cn-gold`, `cn-cyan`, `cn-ink`, `cn-primary-*`, `cn-bg`, `cn-surface`, …) | **kept as-is** | Tailwind v4 `@theme` tokens; `cn` = carnival, already short and consistent; renaming touches hundreds of utility classes for zero clarity gain |

The `cn-*` token exception is deliberate: they're theme tokens (`text-cn-gold`, `bg-cn-primary`) that behave like Tailwind's own `slate-500` — short prefixes are the industry norm there.

## 5. Execution order (single build-mode turn per step, verified between)

1. **Delete dead code** — remove `RegistrationForm.tsx`.
2. **File/folder moves** — perform every rename in §1 and §2 with `mv`, then rewrite imports across `src/`. Run `bunx tsgo --noEmit` + `bun run build`.
3. **Component export renames** — `Wizard` → `RegistrationWizard` inside the wizard file and its three route call sites. Re-verify build.
4. **CSS class renames** — one prefix family at a time (`wiz-*` → `wizard-*`, then `sec-*`, then `em-*`/`tc-*`/`ev-*`/`reg-*`). For each family: batch-replace in `src/styles.css` and every `.tsx`, then Playwright-screenshot `/`, `/iupc`, `/ctf`, `/hackathon` at 1280×1800 and eyeball against pre-refactor screenshots.
5. **Final verification** — `rg` for every old identifier to prove zero stragglers; `bunx tsgo --noEmit`; `bun run build`; visual pass on all five routes plus registration wizard step-by-step.

## What explicitly stays

- Route paths (`/iupc`, `/ctf`, `/hackathon`, `/faq`, `/gallery`, `/api/public/sslcz/*`).
- Design token names `cn-*` and their Tailwind utility surface.
- Public/SEO copy, metadata, hero content.
- `EventPage`, `SiteLayout`, `buildMeta`, `image-crop` helpers.
- Event config files and the `EventConfig` schema.

## Risks & mitigations

- **Stale class in one JSX file breaks styling silently.** Mitigation: after each CSS-prefix batch, `rg` for the old prefix and require zero hits before moving on.
- **Import path typos after folder moves.** Mitigation: run `tsgo --noEmit` after step 2 before touching anything else.
- **Route-file component identifier drift.** Mitigation: renames are scoped to internal identifiers only — `createFileRoute` strings never change.

Approve to implement step 1 first; I'll pause between steps for you to eyeball.
