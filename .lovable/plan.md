# BUP CSE Tech Carnival 2.0 — Main Website Implementation Plan (v2)

## Revisions from v1
- **Language:** Plain **JavaScript + JSX** everywhere. No TypeScript in frontend, backend, or shared code. ESLint + JSDoc where helpful.
- **Order of work:** Build the **entire frontend first**, then the backend. Backend integration happens after the UI is complete and reviewed.
- **Backend architecture:** **Modular monolith** (single Express app, feature-scoped modules) — not microservices. Easier to develop, deploy, and hand off.
- **Backend MVP scope:** Only two capabilities in the first backend release — (1) create a registration, (2) list registered teams (admin). Payments, notifications, media uploads, content CMS, and full auth land in later phases.
- **Validation:** No Zod for now. Use **express-validator** on the backend and plain controlled-form checks + small helper functions on the frontend. Zod can be revisited later without breaking the API.
- **Shared code:** No shared TS types package. Shared constants (event slugs, statuses) live in a tiny `packages/shared/constants.js` re-exported by both apps, or duplicated if simpler.

---

## Tech Stack

**Frontend**
- React 19 + Vite 7 (JSX)
- TanStack Router (file-based) + TanStack Query
- Tailwind CSS v4
- Framer Motion, @tabler/icons-react, @leenguyen/react-flip-clock-countdown, react-easy-crop
- Axios (API client), sonner (toasts — added when backend integration begins)
- ESLint + Prettier

**Backend (added in Phase 8+)**
- Node.js 20 LTS + Express 4
- MongoDB Atlas + Mongoose
- express-validator, helmet, cors, morgan, compression, cookie-parser
- multer (later, for ID card uploads) + Cloudinary
- jsonwebtoken + argon2 (admin auth only)
- nodemailer (later)
- ESLint + Prettier + nodemon

**Infra**
- GitHub (single repo, `apps/web` + `apps/api`, pnpm workspaces)
- Vercel (frontend), Render (backend), MongoDB Atlas, Cloudinary
- GitHub Actions for lint + build checks

---

## Folder Scaffolding

```text
bup-carnival-main/
├── .github/workflows/ci.yml
├── .editorconfig
├── .nvmrc
├── package.json                    # workspace root
├── pnpm-workspace.yaml
├── README.md
├── apps/
│   ├── web/                        # Frontend (JSX)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── layout/         # NavBar, Footer, AmbientBg
│   │   │   │   ├── home/           # Hero, Countdown, Tracks, Timeline, Legacy, Contact
│   │   │   │   ├── event/          # EventPage shell, CountdownBar
│   │   │   │   ├── registration/   # Wizard engine + shared step primitives
│   │   │   │   ├── id-card/        # IdCardUploader + crop
│   │   │   │   └── common/         # Button, Field, Toast wrapper
│   │   │   ├── routes/             # TanStack file-based routes
│   │   │   ├── lib/
│   │   │   │   ├── api.js          # axios instance
│   │   │   │   ├── queries.js      # TanStack Query hooks
│   │   │   │   ├── seo.js
│   │   │   │   └── image-crop.js
│   │   │   ├── data/               # Static content (tracks, sponsors, timeline)
│   │   │   ├── styles.css
│   │   │   ├── router.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── api/                        # Backend (added Phase 8)
│       ├── src/
│       │   ├── config/             # env.js, db.js, logger.js
│       │   ├── modules/
│       │   │   ├── registration/
│       │   │   │   ├── registration.model.js
│       │   │   │   ├── registration.controller.js
│       │   │   │   ├── registration.service.js
│       │   │   │   ├── registration.routes.js
│       │   │   │   └── registration.validators.js
│       │   │   └── admin/          # (Phase 9) auth + teams list
│       │   ├── middleware/         # error, notFound, requireAdmin, rateLimit
│       │   ├── utils/              # apiError, asyncHandler, ids
│       │   ├── app.js
│       │   └── server.js
│       ├── .env.example
│       ├── nodemon.json
│       └── package.json
└── packages/
    └── shared/
        └── constants.js            # EVENT_SLUGS, REG_STATUS, etc.
```

---

## Phase 0 — Prerequisites & Editor Setup

**Install locally**
- Node 20 LTS (via `nvm`), pnpm 9, Git, MongoDB Compass, Postman/Insomnia.

**VS Code extensions**
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- ES7+ React/Redux/React-Native snippets (dsznajder.es7-react-js-snippets)
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
- `.gitignore` (node_modules, dist, .env, .DS_Store)

---

## Phase 1 — Repo & Workspace Bootstrap
Init git, create GitHub repo, `pnpm init`, add `pnpm-workspace.yaml` listing `apps/*` and `packages/*`, push `main`, protect branch, add PR template.

## Phase 2 — Frontend Scaffold & Initial Deploy
Scaffold `apps/web` with Vite React (JSX) template, install router/query/tailwind, add placeholder home page, wire Vercel → auto-deploy from `main`. Verify live URL.

## Phase 3 — Design System & Shared Chrome
Port `styles.css` tokens, `NavBar`, `Footer`, `AmbientBg`, base layout, SEO helper, common `Button`/`Field` primitives.

## Phase 4 — Home Page
Hero + countdown, Segment Showcase, Core Tracks (with code blocks), Timeline, Legacy, Contact form (client-side only for now), Sponsors marquee.

## Phase 5 — Event Pages
`/events/iupc`, `/events/ctf`, `/events/hackathon` via `EventPage` shell + `CountdownBar`.

## Phase 6 — Content Pages
FAQ (with search + accordion), Gallery.

## Phase 7 — Registration Wizard (Frontend-only)
Config-driven `Wizard` engine, event-specific configs, `IdCardUploader` with crop. Submit handler stubs (`console.log` + fake success screen). No backend calls yet. Frontend milestone complete → tag `v1.0-frontend`.

## Phase 8 — Backend Scaffold & Initial Deploy
Scaffold `apps/api` (Express + Mongoose), health route `GET /api/health`, connect MongoDB Atlas, deploy to Render from `main`, verify.

## Phase 9 — Registration API (Backend MVP)
Implement the two endpoints below. Wire frontend wizard's final step to `POST /api/registrations`. Add tiny admin token (env var) guarding the list endpoint for now; real admin auth deferred.

## Phase 10 — QA & Handover
Manual test matrix (all 3 events, all steps, edge cases), Lighthouse, README with run/deploy steps, environment matrix, handover doc.

## Phases 11–18 (deferred, unchanged in intent)
Admin auth, payments (SSLCommerz), notifications (email), media uploads to Cloudinary, content CMS, analytics, hardening, launch.

---

## Backend API (MVP surface)

### Category: Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | none | Liveness probe |

**GET `/api/health`**
| Direction | Field | Type | Notes |
|---|---|---|---|
| Response 200 | `status` | string | `"ok"` |
| Response 200 | `uptime` | number | seconds |

### Category: Registration
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/registrations` | public | Create a registration for an event |
| GET | `/api/registrations` | admin token | List registrations (filter by event) |

**POST `/api/registrations`**

Request body
| Field | Type | Required | Notes |
|---|---|---|---|
| `event` | string enum | yes | `"iupc" \| "ctf" \| "hackathon"` |
| `teamName` | string | yes | 3–60 chars |
| `institution` | string | yes | |
| `coach` | object | iupc only | `{ name, email, phone, designation }` |
| `members` | array | yes | 1–3 objects: `{ name, email, phone, studentId, department, semester }` |
| `projectTitle` | string | hackathon only | |
| `projectSummary` | string | hackathon only | ≤ 500 chars |
| `notes` | string | no | ≤ 500 chars |

Response 201
| Field | Type | Notes |
|---|---|---|
| `id` | string | Mongo ObjectId |
| `code` | string | Short reference, e.g. `IUPC-7F3A2` |
| `event` | string | echo |
| `status` | string | `"pending"` |
| `createdAt` | string | ISO date |

Response errors: `400` validation (`{ error, details[] }`), `409` duplicate team name per event, `500` server.

**GET `/api/registrations?event=iupc&status=pending&page=1&limit=20`**

Query
| Field | Type | Required | Notes |
|---|---|---|---|
| `event` | string enum | no | filter |
| `status` | string enum | no | `pending \| approved \| rejected` |
| `page` | number | no | default 1 |
| `limit` | number | no | default 20, max 100 |

Headers: `x-admin-token: <ADMIN_TOKEN>`

Response 200
| Field | Type | Notes |
|---|---|---|
| `items` | array | registration objects (same shape as POST response + `members`, `coach`, `projectTitle`, `projectSummary`) |
| `page` | number | |
| `limit` | number | |
| `total` | number | |

---

## Database Model (Mongoose)

```js
// apps/api/src/modules/registration/registration.model.js
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
    ipHash:         { type: String },       // hashed submitter IP for abuse control
    userAgent:      { type: String },
  },
  { timestamps: true }
);

RegistrationSchema.index({ event: 1, teamName: 1 }, { unique: true });

module.exports = model('Registration', RegistrationSchema);
```

---

## Environment Variables

**Frontend (`apps/web/.env`)**
| Key | Example | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.carnival.example.com` | axios base |

**Backend (`apps/api/.env`)**
| Key | Example | Notes |
|---|---|---|
| `NODE_ENV` | `development` | |
| `PORT` | `4000` | |
| `MONGODB_URI` | `mongodb+srv://...` | Atlas |
| `CORS_ORIGIN` | `http://localhost:5173,https://carnival.example.com` | comma list |
| `ADMIN_TOKEN` | long random string | Phase 9 gate for list endpoint |
| `RATE_LIMIT_WINDOW_MS` | `60000` | |
| `RATE_LIMIT_MAX` | `20` | |

---

## Registration Form Steps (frontend, unchanged from prototype)

Common shell: Stepper → per-step form → Review → Submit.

- **IUPC** — 1) Team Info · 2) Coach · 3) Members (1–3) · 4) Review
- **CTF** — 1) Team Info · 2) Members (1–3) · 3) Review
- **Hackathon** — 1) Team Info · 2) Members (1–3) · 3) Project · 4) Review

All events end with a success screen showing the returned `code`.

---

## Next Step
Approve this v2 plan. When you say "start Phase 0", I'll produce the concrete file list and commands for editor + repo setup.
