## Verified current state of `src/styles/carnival.css`

I audited every class and CSS variable in `carnival.css` against the JSX and against `src/styles.css`. **Deleting it today would break the site.** Two concrete blockers, everything else is dead code:

**Blocker A — 13 classes still referenced in JSX are defined only in `carnival.css`:**
`reg-card` (used 22×), `reg-success`, `coach-block`, `coach-grid`, `member-row`, `members-block`, `members-label`, `institution-autocomplete`, `institution-option`, `institution-suggestions`, `phone-input`, `phone-prefix`, `copy-btn`.
Consumers: `src/components/carnival/RegistrationForm.tsx` (shared by `IupcRegistration`, `CtfRegistration`, `HackathonRegistration`, `IdCardUploader`) and `src/routes/faq.tsx`.

**Blocker B — 22 CSS custom properties defined in `carnival.css`'s `:root` are read by rules already migrated into `styles.css`:**
`--primary`, `--primary-dark`, `--primary-light`, `--primary-mid`, `--primary-pale`, `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--accent-bg`, `--text`, `--muted`, `--muted2`, `--border`, `--border-strong`, `--gold`, `--gold-dim`, `--cyan`, `--mint`, `--coral`, `--glow-gold`, `--fm`, `--fd`.
Removing `carnival.css` first would silently break colors/fonts/borders across every already-migrated section (hero, tracks, timeline, sponsors, event hero, CountdownBar, FAQ, gallery, CTA).

Everything else in `carnival.css` (261 selectors defined, only 17 referenced from JSX) is dead. `carnival-wizard.css` is already gone from Phase 7.

## Phase 9 — safely retire `carnival.css` (aligned with the master plan)

Order matters: migrate first, delete last, verify at each step. No JSX/design changes.

### Step 1 — Promote legacy `:root` vars into the token system
In `src/styles.css`, extend `@theme inline` with the 22 tokens above, sourcing them from the shadcn-style `:root` block. Where a token maps to an existing `cn-*` token (e.g. `--bg` == `--color-cn-bg`), alias it; where it doesn't, keep the original hex. Result: `styles.css` becomes self-sufficient for tokens and every migrated rule keeps working.

### Step 2 — Migrate the Registration + reg-card CSS block
Extract the ~800 lines covering the 13 classes above and their descendants/media queries from `carnival.css` into `styles.css`, under a clearly-labeled section. Keep class names identical so JSX is untouched. This is a contiguous block — same approach used for sponsors/wizard in earlier phases.

Optional micro-cleanup during the move: if any of those rules only reference `cn-*` tokens after Step 1, prefer `@utility` + Tailwind idioms; otherwise keep as plain class rules. No selector renames.

### Step 3 — Prove `carnival.css` is unreachable
Re-run the two diff scripts:
- `comm -12 <carnival selectors> <jsx classes>` → must be empty.
- `comm -12 <carnival vars> <vars used elsewhere>` → must be empty.
- Also `rg` `carnival.css` in the project — only the single `@import` should remain.

### Step 4 — Remove the import and delete the file
- Delete the `@import "./styles/carnival.css"` line in `src/styles.css` (must remain in the top `@import` block per Lightning CSS).
- `rm src/styles/carnival.css`; remove the empty `src/styles/` directory.

### Step 5 — Visual + runtime verification
- Playwright screenshots at 1280×1800 for `/`, `/iupc`, `/ctf`, `/hackathon`, `/faq`, `/gallery`, compared against pre-deletion captures.
- Walk the IUPC registration wizard through Personal Info → Members → Coach → Payment → Success to confirm `reg-card`, `member-row`, `phone-input`, `institution-autocomplete`, and `reg-success` still render pixel-identical.
- Console + network: no 404s, no Tailwind "unknown utility" warnings, no missing-var fallbacks.

### Rollback
Steps 1–3 are additive; if Step 5 catches any regression, restore `carnival.css` from git and re-open only the offending block. No JSX churn to undo.

## End state after Phase 9
- `src/styles/carnival.css` and `src/styles/carnival-wizard.css` both gone.
- `src/styles.css` is the single stylesheet: `@import "tailwindcss"` + `@theme` tokens + small `@layer base` reset + the handful of `@utility`/component classes that repeat (buttons, wizard, registration, section headers, marquee/glitch keyframes).
- Tailwind v4 utilities in JSX everywhere else. UI pixel-identical.