# Codebase Optimization Plan (UI stays pixel-identical)

Goal: shrink the codebase and enforce DRY without touching the rendered design. Measured on the current tree (`~8.9k LOC` in app source + `~2.7k LOC` styles). Realistic target: **~40–50% reduction in hand-written LOC**, one source of truth per concern.

## Where the duplication actually lives (verified)

| Area | Files | Lines | Duplication |
|---|---|---|---|
| Registration wizards | `IupcRegistration.tsx`, `CtfRegistration.tsx`, `HackathonRegistration.tsx` | 1251 + 1422 + 1601 = **4274** | Same stepper, same field renderers, same review/payment/success screens; only schema + step order differ |
| Event pages | `routes/iupc.tsx`, `ctf.tsx`, `hackathon.tsx` | 85 + 93 + 90 | Identical `event-hero` + `event-meta` + section scaffolding, only copy differs |
| Route `head()` meta | every `routes/*.tsx` + `__root.tsx` | ~15 lines/route | Same og/twitter boilerplate copy-pasted |
| `styles.css` | 2657 lines, 385 class rules | Many hex/px repeats already declared as `--cn-*` tokens; buttons/section headers/eyebrow patterns repeat under aliases |

`RegistrationForm.tsx` (215 lines) already exists but the three event wizards don't use it — they each re-implement the same primitives.

## Plan (phased, each phase ships independently, visual diff after every phase)

### Phase A — Registration engine (biggest win, ~2,500 LOC removed)

Introduce a single **schema-driven** wizard and delete the three copies.

- New: `src/components/carnival/registration/`
  - `WizardShell.tsx` — stepper, progress, prev/next, review, payment, success (extracted verbatim from IUPC, which is the most complete)
  - `fields.tsx` — `TextField`, `PhoneField`, `InstitutionField`, `PhotoField` (thin wrappers over existing classes `wiz-field`, `phone-input`, `institution-autocomplete`, reusing `IdCardUploader`)
  - `types.ts` — `EventConfig`, `StepDef`, `MemberSchema`, `CoachSchema`
  - `events/iupc.config.ts`, `events/ctf.config.ts`, `events/hackathon.config.ts` — pure data: fee, team size rules, steps, member/coach field lists, review layout
- The three route files import `<Wizard config={iupcConfig} />` instead of a bespoke component.
- Delete `IupcRegistration.tsx`, `CtfRegistration.tsx`, `HackathonRegistration.tsx`.
- Keep the existing `wiz-*` CSS classes (they're already the design system for the wizard).

Acceptance: walk each event's Personal → Members → Coach/Review → Payment → Success; DOM class names and rendered markup match a captured baseline.

### Phase B — Event page shell (~150 LOC removed, prevents future drift)

- New: `src/components/carnival/EventPage.tsx` accepting `{ hero: {bg, fg, tag, title, sub, desc, meta[], reporting}, children }`.
- `routes/iupc.tsx`, `ctf.tsx`, `hackathon.tsx` become thin: hero config object + page-specific sections as children.
- No CSS changes; same `event-hero`, `event-meta`, `em-num` classes.

### Phase C — Route metadata helper (~80 LOC removed, guarantees SEO consistency)

- New: `src/lib/seo.ts` exporting `buildMeta({ title, description, ogImage? })` returning the full meta array (title + description + og:* + twitter:*).
- Fix a real bug at the same time: `__root.tsx` currently ships the template defaults `"Lovable App"` / `"Lovable Generated Project"` — replace with real carnival defaults per the head-metadata rule.
- Every route's `head()` becomes `meta: buildMeta({...})`.

### Phase D — `styles.css` consolidation (~600–800 LOC removed, no visual change)

Not a full rewrite — targeted DRY passes only:

1. **Kill legacy `:root` aliases.** `--gold`, `--cyan`, `--bg`, `--text`, `--muted`, `--border`, `--fm`, `--fd` etc. duplicate `--color-cn-*` and `--font-*` tokens introduced in Phase 0. `sed`-replace usages to the canonical token, then delete the alias block. Single source of truth for design tokens.
2. **Promote genuinely reused patterns to `@utility`** (v4-correct): `sec-num`, `sec-title`, `sec-sub`, `eyebrow`, `em-num`, `em-label`, `tc-status`. These are used across ≥3 routes → utilities beat class rules. Leaf one-offs stay as classes.
3. **Merge button variants.** `.btn-primary`, `.btn-ghost`, `.wiz-btn.primary`, `.wiz-btn.ghost`, `.wiz-photo-btn` share ~90% of declarations. Consolidate into one `@utility btn` + size/variant modifiers; keep old class names as thin aliases (`.btn-primary { @apply btn btn-gold; }`) so JSX doesn't change.
4. **Delete dead rules.** Cross-check every remaining selector against `rg -F` in `src/`; drop unreferenced ones (audit from Phase 9 already flagged several).
5. **Collapse repeated `@media (max-width: …)` blocks** by co-locating with their base rule (v4 supports nesting).

Explicitly **not** doing: rewriting `styles.css` into pure Tailwind utilities in JSX. The `@utility`/component-class layer is the right industry pattern for a design system this specific (glitch effects, marquee, wizard chrome). We keep one stylesheet, tighter.

### Phase E — Small component hygiene (~200 LOC removed)

- `SiteLayout.tsx`: extract `NAV_ITEMS` map render into a `<NavLinks variant="header|footer" />` (used twice today, verbatim).
- `IdCardUploader.tsx`: move the huge `getCroppedImg` + `loadImage` helpers into `src/lib/image-crop.ts`.
- `ContactForm.tsx`: reuse the same `TextField` primitive introduced in Phase A.

### Phase F — Verification gate (run after each phase)

- `bun run build` clean, no unknown-utility warnings.
- Playwright screenshots (1280×1800) of `/`, `/iupc`, `/ctf`, `/hackathon`, `/gallery`, `/faq` diffed against a baseline captured before Phase A.
- Full IUPC + CTF + Hackathon registration walk-through, including validation error states and success screen.
- `rg` sweep confirms no orphaned class names or CSS vars.

## What I will NOT change
- Public routes, URLs, SEO slugs.
- Any rendered text, color, spacing, animation timing.
- The Tailwind v4 setup (`@theme` tokens, single stylesheet) — it's already correct.
- Registration form fields, validation rules, fees, payment flow.

## Expected end state
- `src/components/carnival/*Registration.tsx` (4274 LOC) → one `WizardShell` + 3 tiny config files (~800 LOC total).
- Three event routes ~90 LOC each → ~25 LOC each.
- `styles.css` 2657 → ~1900 LOC, no duplicate tokens, buttons/section headers unified.
- One `buildMeta` helper, real app title/description at the root.
- Hand-written LOC down ~40–50%, zero visual diff.

## Order of execution
Phase D.1 (token dedupe) → A → B → C → D.2–5 → E → F. D.1 first because it de-risks A/B (they'll reference canonical tokens from day one).
