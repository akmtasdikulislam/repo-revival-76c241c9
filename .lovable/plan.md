# BUP CSE Tech Carnival 2.0 — Main Website Implementation Plan (v3)

Prototype (this repo) = visual + UX reference. Target rebuild = production **MERN** stack, **plain JavaScript + JSX** (no TypeScript), **modular monolith** backend, human-written by the team. Deployed on Vercel (frontend) + Render (backend) + MongoDB Atlas. Frontend is built first end-to-end; backend follows with an MVP scope (registration only) and grows in later phases.

---

## 1. Revisions from v2 → v3

- Language: **plain JavaScript + JSX** everywhere. ESLint + JSDoc where useful. No TS anywhere in FE, BE, or shared code.
- Order of work: **entire frontend first**, then backend integration.
- Backend architecture: **modular monolith** (single Express app, feature-scoped modules) — not microservices.
- Backend MVP scope (Phase 9): only **(1) create a registration** and **(2) list registered teams (admin)**. Payments, notifications, media, content CMS, full auth are deferred to later phases (11–18).
- Validation: **no Zod**. Backend uses **express-validator**; frontend uses controlled-form checks + small helper functions.
- Shared code: **no shared types package**. Tiny `packages/shared/constants.js` for event slugs / statuses, or duplicated if simpler.
- **Package manager: Yarn (Classic v1 or Berry — team's choice at bootstrap)** with **Yarn workspaces**. No pnpm, no npm.
- **API testing: Postman** — a versioned collection + environment files live in `/postman`.
- **Frontend state: React Context API** for cross-page shared state (wizard draft, admin session, toasts). TanStack Query still handles server cache. No Redux, no Zustand.
- **Folder scaffolding root:** `backend/` and `frontend/` at the repository root (instead of `apps/api` + `apps/web`).

---

## 2. Tech Stack

**Frontend**
- React 19 + Vite 7 (JSX only)
- TanStack Router (file-based) + TanStack Query
- **React Context API** (wizard draft, admin auth, toast bus)
- Tailwind CSS v4 (single global `styles.css`, tokens preserved from prototype)
- Framer Motion, @tabler/icons-react, @leenguyen/react-flip-clock-countdown, react-easy-crop
- Axios (API client), sonner (toasts — added when backend integration begins)
- ESLint + Prettier

**Backend (Phase 8+)**
- Node.js 20 LTS + Express 4
- MongoDB Atlas + Mongoose 8
- express-validator, helmet, cors, morgan, compression, cookie-parser, express-rate-limit
- multer + Cloudinary SDK (Phase 13, for ID card / coach photos)
- jsonwebtoken + argon2 (admin auth, Phase 11)
- nodemailer + Resend/SendGrid (Phase 14)
- SSLCommerz SDK (Phase 12, BDT gateway)
- Jest + Supertest (tests)
- ESLint + Prettier + nodemon

**Infra / DevOps**
- GitHub monorepo (`backend/`, `frontend/`, `packages/shared/`) via **Yarn workspaces**
- Vercel (frontend), Render (backend Web Service), MongoDB Atlas, Cloudinary (later), Resend (later)
- GitHub Actions (lint + build checks; tests once written)
- Postman collection + environments checked into `/postman`
- Sentry (FE + BE) added in Phase 16

---

## 3. Folder Scaffolding

```text
bup-carnival-main/
├── .github/workflows/ci.yml
├── .editorconfig
├── .nvmrc                          # 20
├── .yarnrc.yml                     # if Berry; else omit
├── package.json                    # workspace root
├── yarn.lock
├── README.md
├── postman/
│   ├── carnival.postman_collection.json
│   ├── carnival.local.postman_environment.json
│   └── carnival.production.postman_environment.json
├── frontend/                       # React app (JSX)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/             # NavBar, Footer, AmbientBg, SiteLayout
│   │   │   ├── home/               # Hero, Countdown, Tracks, Timeline, Legacy, Contact, SponsorsMarquee
│   │   │   ├── event/              # EventPage shell, CountdownBar
│   │   │   ├── registration/       # Wizard engine + step primitives
│   │   │   ├── id-card/            # IdCardUploader + crop
│   │   │   └── common/             # Button, Field, Toast wrapper
│   │   ├── context/                # WizardContext, AdminAuthContext, ToastContext
│   │   ├── routes/                 # TanStack file-based routes
│   │   ├── lib/
│   │   │   ├── api.js              # axios instance
│   │   │   ├── queries.js          # TanStack Query hooks
│   │   │   ├── seo.js
│   │   │   └── image-crop.js
│   │   ├── data/                   # Static content (tracks, sponsors, timeline)
│   │   ├── styles.css
│   │   ├── router.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                        # Express modular monolith (Phase 8+)
│   ├── src/
│   │   ├── config/                 # env.js, db.js, logger.js
│   │   ├── modules/
│   │   │   ├── registration/
│   │   │   │   ├── registration.model.js
│   │   │   │   ├── registration.controller.js
│   │   │   │   ├── registration.service.js
│   │   │   │   ├── registration.routes.js
│   │   │   │   └── registration.validators.js
│   │   │   ├── admin/              # Phase 11 (auth + dashboard APIs)
│   │   │   ├── payment/            # Phase 12
│   │   │   ├── content/            # Phase 15
│   │   │   ├── media/              # Phase 13
│   │   │   └── notification/       # Phase 14
│   │   ├── middleware/             # error, notFound, requireAdmin, rateLimit
│   │   ├── utils/                  # apiError, asyncHandler, ids (teamCode)
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   ├── nodemon.json
│   └── package.json
└── packages/
    └── shared/
        └── constants.js            # EVENT_SLUGS, REG_STATUS, TSHIRT_SIZES, etc.
```

Every backend module follows **MVC**: `*.routes.js` → `*.controller.js` → `*.service.js` → `*.model.js`, with `*.validators.js` for express-validator chains.

---

## 4. Phased Implementation

### Phase 0 — Prerequisites & Editor Setup (0.5 day)

**Install locally**
- Node 20 LTS (via `nvm`), **Yarn** (`corepack enable && corepack prepare yarn@stable --activate`), Git, **MongoDB Compass**, **Postman**.

**VS Code extensions**
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- ES7+ React/Redux/React-Native snippets (`dsznajder.es7-react-js-snippets`)
- Auto Rename Tag, Path Intellisense, GitLens, DotENV, MongoDB for VS Code, Thunder Client (optional).

**`.vscode/settings.json`**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "eslint.validate": ["javascript", "javascriptreact"],
  "tailwindCSS.experimental.classRegex": [["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]],
  "files.eol": "\n"
}
```

**Root config files**
- `.editorconfig` (LF, 2-space indent, UTF-8)
- `.nvmrc` → `20`
- `.prettierrc` (single quotes, semi, width 100)
- `.eslintrc.cjs` extending `eslint:recommended` + `plugin:react/recommended` + `plugin:react-hooks/recommended`
- `.gitignore` (node_modules, dist, .env, .DS_Store, .yarn/cache if Berry)

### Phase 1 — Repo & Workspace Bootstrap (0.5 day)
- `git init`, create GitHub repo, protect `main`, add PR template + CODEOWNERS.
- `yarn init -y` at root; add `"private": true` and `"workspaces": ["frontend", "backend", "packages/*"]`.
- Push `main` and `dev` branches.

### Phase 2 — Frontend Scaffold & Initial Deploy (1 day)
- Scaffold `frontend/` with Vite React (JSX) template (`yarn create vite frontend --template react`).
- Install router / query / tailwind / framer / icons / countdown / easy-crop / axios.
- Placeholder home page.
- Wire Vercel → auto-deploy from `main`, preview deploys per PR. Verify live URL.

### Phase 3 — Design System & Shared Chrome (2 days)
- Port `styles.css` tokens, `NavBar`, `Footer`, `AmbientBg`, `SiteLayout`, SEO helper, `Button` / `Field` primitives.
- Create root Context providers: `ToastContext`, `AdminAuthContext` (stub), `WizardContext` (stub).

### Phase 4 — Home Page (3 days)
Hero + countdown, Segment Showcase, Core Tracks (with code blocks), Timeline, Legacy, Contact form (client-side only), Sponsors marquee.

### Phase 5 — Event Pages (1 day)
`/events/iupc`, `/events/ctf`, `/events/hackathon` via shared `EventPage` shell + `CountdownBar`.

### Phase 6 — Content Pages (1 day)
FAQ (search + accordion), Gallery.

### Phase 7 — Registration Wizard (Frontend-only) (3 days)
- Config-driven `Wizard` engine, per-event configs, `IdCardUploader` with crop.
- Wizard draft state lives in `WizardContext` + sessionStorage.
- Submit handler = `console.log` + fake success screen (no backend yet).
- Tag `v1.0-frontend`.

### Phase 8 — Backend Scaffold & Initial Deploy (1 day)
- Scaffold `backend/` (Express + Mongoose), `GET /api/health`, connect MongoDB Atlas.
- Deploy to Render from `main`, verify `/api/health` returns 200.
- Add Postman collection with the health request + `local` and `production` environments.

### Phase 9 — Registration API (Backend MVP) (2 days)
- Implement `POST /api/registrations` and `GET /api/registrations` (see §5).
- Simple `x-admin-token` env-var guard on the list endpoint (real admin auth deferred to Phase 11).
- Wire frontend wizard's final step to `POST /api/registrations` via axios; show returned `code` on success.
- Update Postman collection with both endpoints + sample bodies.

### Phase 10 — QA & Handover of MVP (1 day)
- Manual test matrix across all three events, every wizard step, edge cases.
- Lighthouse ≥ 90.
- README with run/deploy steps, environment matrix, Postman usage.

### Phases 11–18 (deferred — intent unchanged from v1)
- **11** Admin auth (JWT + argon2, admin dashboard shell, protected list endpoint).
- **12** Payments (SSLCommerz init + IPN + success/fail/cancel + reconciliation cron).
- **13** Media uploads (Cloudinary signed uploads, wire to IdCardUploader).
- **14** Notifications (nodemailer / Resend; confirmation + admin digest).
- **15** Content CMS (sponsors, tracks, timeline, FAQ, gallery moved from static data).
- **16** Analytics + Sentry + uptime monitoring.
- **17** Security hardening + UAT on staging.
- **18** Production cutover, DNS, handover doc + runbook.

---

## 5. Backend API — MVP Surface (Phases 8–9)

Base path: `/api`. Later phases add `/api/admin/*`, `/api/payments/*`, `/api/content/*`, etc.

### Category: Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | none | Liveness probe |

**GET `/api/health` — Response 200**

| Field | Type | Notes |
|---|---|---|
| `status` | string | `"ok"` |
| `uptime` | number | seconds |

### Category: Registration

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/registrations` | public | Create a registration for an event |
| GET | `/api/registrations` | admin token | List registrations (filter by event / status) |

**POST `/api/registrations` — Request body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `event` | string enum | yes | `"iupc" \| "ctf" \| "hackathon"` |
| `teamName` | string | yes | 3–60 chars |
| `institution` | string | yes | |
| `coach` | object | iupc only | `{ name, email, phone, designation }` |
| `members` | array | yes | 1–3 items: `{ name, email, phone, studentId, department, semester }` |
| `projectTitle` | string | hackathon only | |
| `projectSummary` | string | hackathon only | ≤ 500 chars |
| `notes` | string | no | ≤ 500 chars |

**POST `/api/registrations` — Response 201**

| Field | Type | Notes |
|---|---|---|
| `id` | string | Mongo ObjectId |
| `code` | string | Short reference, e.g. `IUPC-7F3A2` |
| `event` | string | echo |
| `status` | string | `"pending"` |
| `createdAt` | string | ISO date |

Error responses: `400` validation (`{ error, details[] }`), `409` duplicate team name per event, `500` server.

**GET `/api/registrations` — Query**

| Field | Type | Required | Notes |
|---|---|---|---|
| `event` | string enum | no | filter |
| `status` | string enum | no | `pending \| approved \| rejected` |
| `page` | number | no | default 1 |
| `limit` | number | no | default 20, max 100 |

Headers: `x-admin-token: <ADMIN_TOKEN>`

**GET `/api/registrations` — Response 200**

| Field | Type | Notes |
|---|---|---|
| `items` | array | registration objects (POST response shape + `members`, `coach`, `projectTitle`, `projectSummary`) |
| `page` | number | |
| `limit` | number | |
| `total` | number | |

---

## 6. Database Model (Mongoose, MVP)

```js
// backend/src/modules/registration/registration.model.js
const { Schema, model } = require('mongoose');

const MemberSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    studentId:   { type: String, required: true, trim: true },
    department:  { type: String, required: true, trim: true },
    semester:    { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CoachSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const RegistrationSchema = new Schema(
  {
    event:          { type: String, enum: ['iupc', 'ctf', 'hackathon'], required: true, index: true },
    code:           { type: String, required: true, unique: true, index: true },
    teamName:       { type: String, required: true, trim: true },
    institution:    { type: String, required: true, trim: true },
    coach:          { type: CoachSchema, required: function () { return this.event === 'iupc'; } },
    members:        { type: [MemberSchema], validate: v => v.length >= 1 && v.length <= 3 },
    projectTitle:   { type: String, trim: true },
    projectSummary: { type: String, trim: true, maxlength: 500 },
    notes:          { type: String, trim: true, maxlength: 500 },
    status:         { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    ipHash:         { type: String },   // hashed submitter IP for abuse control
    userAgent:      { type: String },
  },
  { timestamps: true }
);

RegistrationSchema.index({ event: 1, teamName: 1 }, { unique: true });

module.exports = model('Registration', RegistrationSchema);
```

Later-phase models (deferred): `Admin`, `Payment`, `Sponsor`, `Track`, `TimelineEvent`, `FaqItem`, `GalleryItem`, `SiteSettings`, `ContactMessage`.

---

## 7. Registration Form Steps (Frontend)

Common shell: **Stepper → per-step form → Review → Submit → Success**. Wizard draft persists in `WizardContext` + `sessionStorage` so a page refresh does not wipe progress.

- **IUPC** — 1) Team Info · 2) Coach · 3) Members (1–3) · 4) Review
- **CTF** — 1) Team Info · 2) Members (1–3) · 3) Review
- **Hackathon** — 1) Team Info · 2) Members (1–3) · 3) Project · 4) Review

All events end with a success screen showing the returned `code`. Validation happens field-by-field with tiny helpers (no Zod).

---

## 8. Frontend Route Plan

| Route | Purpose | Data source (MVP) |
|---|---|---|
| `/` | Landing (hero, tracks, timeline, sponsors, legacy, contact) | static `src/data/*` |
| `/events/iupc` | IUPC page | static |
| `/events/ctf` | CTF page | static |
| `/events/hackathon` | Hackathon page | static |
| `/faq` | FAQ accordion + search | static |
| `/gallery` | Gallery grid | static |
| `/register/:event` | Wizard | POST `/api/registrations` |
| `/thank-you/:code` | Success screen | wizard state |
| `/admin/registrations` | List (Phase 11) | GET `/api/registrations` |

---

## 9. Environment Variables

**Frontend (`frontend/.env`)**

| Key | Example | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.carnival.example.com` | axios base |

**Backend (`backend/.env`)**

| Key | Example | Notes |
|---|---|---|
| `NODE_ENV` | `development` | |
| `PORT` | `4000` | |
| `MONGODB_URI` | `mongodb+srv://...` | Atlas |
| `CORS_ORIGIN` | `http://localhost:5173,https://carnival.example.com` | comma list |
| `ADMIN_TOKEN` | long random string | Phase 9 gate for list endpoint |
| `RATE_LIMIT_WINDOW_MS` | `60000` | |
| `RATE_LIMIT_MAX` | `20` | |

Later phases add: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SSLCZ_STORE_ID`, `SSLCZ_STORE_PASSWORD`, `SSLCZ_IS_LIVE`, `SUCCESS_URL`, `FAIL_URL`, `CANCEL_URL`, `IPN_URL`, `CLOUDINARY_*`, `RESEND_API_KEY`, `MAIL_FROM`, `SENTRY_DSN`.

---

## 10. Postman Setup

- Collection: `postman/carnival.postman_collection.json` — one folder per module (Health, Registration, later: Admin, Payment, Content).
- Environments: `local` (`baseUrl=http://localhost:4000`, `adminToken=...`) and `production` (`baseUrl=https://api.carnival.example.com`, `adminToken={{PROD_ADMIN_TOKEN}}`).
- Every request has an example response and, for POSTs, a saved example body.
- Team members import the collection + their local environment on day one; CI does not run Postman (Jest+Supertest covers regression later).

---

## 11. Timeline (working days, MVP)

Phases 0–2: 2d · 3–4: 5d · 5–7: 5d · 8–10: 4d ⇒ **~16 working days (~3 weeks)** to a live site with a working registration MVP. Phases 11–18 extend beyond that as scope opens up.

---

## 12. Success Criteria (MVP)

- Home + all event pages + FAQ + Gallery live on Vercel, pixel-parity with prototype.
- Registration wizard for all three events submits successfully to Render backend and shows a real `code`.
- Admin can list registrations via Postman with the `x-admin-token` header.
- Lighthouse ≥ 90 on `/`, `/events/*`, `/faq`.
- README + Postman collection + `.env.example` files complete enough for a new dev to run the stack in under 15 minutes.

---

## Next Step
Approve v3. When you say "start Phase 0", I'll produce the concrete file list and shell commands for editor + repo setup.
