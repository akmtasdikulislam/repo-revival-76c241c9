# Phase A — Registration Engine

Consolidate `IupcRegistration.tsx` (1,251) + `CtfRegistration.tsx` (1,422) + `HackathonRegistration.tsx` (1,601) = **4,274 LOC** into one schema-driven wizard + three tiny config files (~800 LOC total). Zero visual/behavioral change.

## Confirmed differences between the three (drives the config shape)

| Concern | IUPC | CTF | Hackathon |
|---|---|---|---|
| Team size | Fixed **3** | Chooser: **1–4** (solo flow vs team flow) | Chooser: **1–4** (solo vs team flow) |
| Coach | Yes (required step) | No | No |
| Project step | No | No | Yes (title/pitch/problem/stack) |
| Solo prefix step | No | `StepSolo` | `StepSolo` |
| Step flow | `team → members → coach → review → payment` | solo: `solo → review → payment` / team: `team → members → review → payment` | solo: `solo → project → review → payment` / team: `team → members → project → review → payment` |
| Fee | 500 × 3 = 1500 BDT | 500 × N | 500 × N |
| Roles list | — | — | `ROLE_OPTIONS` on members |

Everything else — `StepBar`, `FeeBanner`, `Field`, `PhoneInput`, `PhotoUploader`, `StepTeam`, `StepMembers`, `StepReview`, `StepPayment`, `SuccessPanel`, `SummaryAside`, `SizeChart`, `TSHIRT_SIZES`, `YEAR_OPTIONS`, `emailRe`, `digits`, institution autocomplete, agree checkboxes, SSLCommerz init, payError handling, motion variants — is duplicated across all three.

## Target file layout

```text
src/components/carnival/registration/
  WizardShell.tsx        # top-level: state, flow control, step dispatch, payment, success
  types.ts               # EventConfig, StepId, Member, Coach, Project, FlowResolver
  fields.tsx             # Field, PhoneInput, PhotoUploader, InstitutionAutocomplete
  steps/
    StepTeam.tsx         # team name + institution + leader (shared)
    StepSolo.tsx         # solo variant of leader form (CTF/Hackathon)
    StepMembers.tsx      # dynamic members list; role column shown iff config.showMemberRole
    StepCoach.tsx        # coach form (IUPC only, gated by config.coach)
    StepProject.tsx      # project form (Hackathon only, gated by config.project)
    StepReview.tsx       # renders sections driven by config.reviewSections
    StepPayment.tsx      # agree checkboxes + payMethod + SSLCommerz init
  parts/
    StepBar.tsx
    FeeBanner.tsx
    SummaryAside.tsx
    SizeChart.tsx
    TeamSizeChooser.tsx  # CTF/Hackathon prefix
    SuccessPanel.tsx
  events/
    iupc.config.ts
    ctf.config.ts
    hackathon.config.ts
```

All existing `wiz-*` / `phone-input` / `institution-autocomplete` CSS classes stay — the JSX class names don't change.

## `EventConfig` shape (types.ts)

```ts
type EventKey = "iupc" | "ctf" | "hackathon";

type EventConfig = {
  key: EventKey;
  displayName: string;         // "IUPC" | "CTF" | "Hackathon"
  feePerPerson: number;        // 500

  team:
    | { kind: "fixed"; size: number }          // IUPC: 3
    | { kind: "chooser"; min: 1; max: 4 };     // CTF/Hackathon

  coach?: { required: true };                  // IUPC only
  project?: { fields: ProjectFieldDef[] };     // Hackathon only
  showMemberRole?: boolean;                    // Hackathon only

  // Flow resolver — pure function so both solo/team branches live in config:
  resolveFlow: (ctx: { teamSize: number }) => StepId[];

  copy: {
    teamStepTitle: string;
    membersHint: string;
    successHeadline: string;
    // etc. — only strings that actually differ between events
  };
};
```

Configs (~60 LOC each) hold ONLY the differences above. Everything else lives in `WizardShell`/steps.

## Migration steps (single turn, verified at the end)

1. Create `types.ts`, `fields.tsx`, and every file under `steps/`, `parts/`, `events/` by lifting the existing IUPC implementations (most complete) verbatim, then generalizing only where the table above shows divergence.
2. Create `WizardShell.tsx`:
   - Holds `teamSize`, `step`, `touched`, `teamName`, `institution`, `leader*`, `members`, `coach`, `project`, `agree*`, `payMethod`, `submitting`, `done`, `payError`, `code`.
   - Derives `flow = config.resolveFlow({ teamSize })`.
   - Renders `<StepBar />`, `<FeeBanner />`, active step, `<SummaryAside />`.
   - Owns the SSLCommerz `initSslczSession` call and success screen (IUPC's version is the canonical one).
3. Write the three config files (`iupc.config.ts`, `ctf.config.ts`, `hackathon.config.ts`).
4. Update routes to swap the component imports:
   - `iupc.tsx` → `<Wizard config={iupcConfig} />` (replace `<IupcRegistration />`).
   - `ctf.tsx` → `<Wizard config={ctfConfig} />`.
   - `hackathon.tsx` → `<Wizard config={hackathonConfig} />`.
   - Export `Wizard` as the default from `WizardShell.tsx`.
5. `rm src/components/carnival/{Iupc,Ctf,Hackathon}Registration.tsx`.
6. Verification (still Phase A, before we move on):
   - `bunx tsgo --noEmit` clean.
   - `bun run build` clean, no unknown-utility warnings.
   - Playwright 1280×1800 walkthrough of each event: pick team size (CTF/Hack), fill team → members → coach/project → review → payment, trigger validation errors on each step, verify success screen. Screenshot each step and eyeball against the current build.
   - `rg -F "IupcRegistration|CtfRegistration|HackathonRegistration"` returns zero matches in `src/`.

## What stays untouched

- All `wiz-*`, `phone-input`, `institution-autocomplete`, `reg-card` CSS.
- Fee math, validation rules, SSLCommerz flow, success code generation.
- Route paths, SEO metadata, hero sections, `EventPage` shell.
- `IdCardUploader` (already presentation-only after Phase E.2).

## Risks & mitigation

- **Behavioral drift on payment/success** — I'll port IUPC's payment/success verbatim (it's the most complete) and hand-test the CTF/Hack redirects.
- **Divergent copy silently unified** — every user-visible string that differs stays in `config.copy`; no invented text.
- **Validation regressions** — validators live next to their step; touched-key names preserved so error styling matches.

Approve to implement in the next turn.
