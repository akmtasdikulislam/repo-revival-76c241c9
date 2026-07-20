# BUP CSE Tech Carnival 2.0 — Full Build Plan (MERN, JavaScript)

Stack: React 19 + Vite + JSX (no TS), Tailwind v4, React Router, TanStack Query, Framer Motion. Backend: Node 20 + Express 5 (modular monolith, MVC), MongoDB Atlas + Mongoose, JWT auth, Multer + Cloudinary for uploads, SSLCommerz for payments, Nodemailer for mail. Deploy: Vercel (frontend), Render/Railway (backend), MongoDB Atlas, Cloudinary. Repo: pnpm workspaces monorepo (`apps/web`, `apps/api`, `packages/shared`).

---

## Phase 0 — Prerequisites & Editor Setup

Install locally:

- Node 20 LTS, pnpm 9, Git, MongoDB Compass (optional).
- VS Code + extensions: ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig, GitLens, DotENV, Error Lens, Path Intellisense, Auto Rename Tag, ES7+ React snippets, MongoDB for VS Code, Thunder Client (or Postman).

VS Code `.vscode/settings.json` (committed):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "eslint.validate": ["javascript", "javascriptreact"],
  "tailwindCSS.includeLanguages": { "javascript": "javascript", "javascriptreact": "javascript" },
  "files.eol": "\n"
}
```

Committed at repo root: `.editorconfig`, `.prettierrc`, `.prettierignore`, `.gitignore`, `.nvmrc` (20), `eslint.config.js` (flat config: `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`). Husky + lint-staged for pre-commit lint/format. Commitlint (Conventional Commits).

Accounts: GitHub, Vercel, Render (or Railway), MongoDB Atlas, Cloudinary, SSLCommerz sandbox, Google (SMTP app password or Resend).

---

## Phase 1 — Repo & Monorepo Scaffold

Create GitHub repo `bup-cse-tech-carnival` (private → public later). Branches: `main` (protected), `dev`, feature branches `feat/*`. PR template + CODEOWNERS. GitHub Actions CI: lint + build on PR.

### Folder structure

```
bup-cse-tech-carnival/
├─ .github/workflows/ci.yml
├─ .vscode/
├─ apps/
│  ├─ web/                     # React + Vite frontend (JSX)
│  │  ├─ public/
│  │  ├─ src/
│  │  │  ├─ assets/
│  │  │  ├─ components/
│  │  │  │  ├─ layout/          # SiteLayout, Nav, Footer
│  │  │  │  ├─ home/            # Hero, Tracks, Sponsors, Contact
│  │  │  │  ├─ event/           # EventPage, CountdownBar
│  │  │  │  ├─ registration/    # Wizard + steps + fields
│  │  │  │  └─ id-card/
│  │  │  ├─ pages/              # route components
│  │  │  │  ├─ Home.jsx
│  │  │  │  ├─ Iupc.jsx
│  │  │  │  ├─ Ctf.jsx
│  │  │  │  ├─ Hackathon.jsx
│  │  │  │  ├─ Faq.jsx
│  │  │  │  ├─ Gallery.jsx
│  │  │  │  └─ payment/{Success,Fail,Cancel}.jsx
│  │  │  ├─ routes/AppRouter.jsx
│  │  │  ├─ hooks/
│  │  │  ├─ lib/                # api client, helpers, seo
│  │  │  ├─ data/               # sponsors, institutions, gallery
│  │  │  ├─ styles.css
│  │  │  ├─ App.jsx
│  │  │  └─ main.jsx
│  │  ├─ index.html
│  │  ├─ vite.config.js
│  │  └─ package.json
│  └─ api/                     # Express backend (modular monolith, MVC)
│     ├─ src/
│     │  ├─ config/            # env, db, cloudinary, mailer
│     │  ├─ modules/
│     │  │  ├─ registration/
│     │  │  │  ├─ registration.model.js
│     │  │  │  ├─ registration.controller.js
│     │  │  │  ├─ registration.service.js
│     │  │  │  ├─ registration.routes.js
│     │  │  │  └─ registration.validator.js
│     │  │  ├─ payment/        # sslcommerz init + ipn
│     │  │  ├─ upload/         # id-card uploads
│     │  │  └─ health/
│     │  ├─ middlewares/       # error, notFound, rateLimit, auth (later)
│     │  ├─ utils/             # asyncHandler, ApiError, logger
│     │  ├─ app.js
│     │  └─ server.js
│     ├─ .env.example
│     └─ package.json
├─ packages/
│  └─ shared/                  # event configs, constants shared FE/BE
│     ├─ src/{events,constants,index}.js
│     └─ package.json
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

---

## Phase 2 — Frontend Migration (current prototype → JSX)

1. Copy existing React components from the prototype into `apps/web/src/` and strip all TypeScript annotations (rename `.tsx`→`.jsx`, `.ts`→`.js`, drop generics/types/interfaces).
2. Replace TanStack Start file-based routing with `react-router-dom` v6 in `AppRouter.jsx`. Move each `src/routes/*.tsx` into `src/pages/*.jsx`.
3. Keep Tailwind v4 setup and `src/styles.css` as-is.
4. SEO with `react-helmet-async`; per-page `<Seo />` helper in `lib/seo.js`.
5. API client in `lib/api.js` using `fetch` wrapper with base URL from `VITE_API_URL`. Use TanStack Query for data fetching.
6. Registration wizard keeps current UI; on submit calls `POST /api/registrations` then `POST /api/payments/sslcz/init`, then redirects to gateway URL.
7. Deploy frontend to Vercel from `main` (preview on PRs).

Deliverable: identical UI to the prototype, running as plain JSX on Vercel, talking to a stub API URL.

---

## Phase 3 — Backend Phase 1 (Registration + List only)

Modular monolith, MVC. Only two modules implemented now: `registration` and `payment` (SSLCommerz init + IPN + return URLs). `upload` (Cloudinary signed uploads) is included because ID-card photos are required. Everything else (auth, admin panel, mailer templates beyond receipt, analytics, judging, CMS) is deferred.

Dependencies (`apps/api`):

- Runtime: `express`, `mongoose`, `cors`, `helmet`, `morgan`, `compression`, `express-rate-limit`, `dotenv`, `multer`, `cloudinary`, `nodemailer`, `axios`, `nanoid`, `dayjs`.
- Dev: `nodemon`, `eslint`, `prettier`, `jest` + `supertest` (later).
- No Zod for now — hand-rolled validators in `*.validator.js` returning `{ok, errors}`.

Env vars (`apps/api/.env.example`):

```
NODE_ENV=development
PORT=8080
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=                # reserved for later
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SSLCZ_STORE_ID=
SSLCZ_STORE_PASSWORD=
SSLCZ_IS_SANDBOX=true
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="BUP CSE Carnival <noreply@bupcse.org>"
```

Frontend env (`apps/web/.env`): `VITE_API_URL=http://localhost:8080`.

### Database schema (Mongoose)

```js
// apps/api/src/modules/registration/registration.model.js
const { Schema, model } = require('mongoose');

const MemberSchema = new Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  department:  { type: String, required: true, trim: true },
  year:        { type: String, required: true },
  tshirt:      { type: String, enum: ['S','M','L','XL','XXL'], required: true },
  idNumber:    { type: String, required: true, trim: true },
  idCardUrl:   { type: String, required: true },    // Cloudinary URL
  discord:     { type: String, trim: true },
  role:        { type: String, trim: true },
}, { _id: false });

const CoachSchema = new Schema({
  fullName:    { type: String, required: true },
  designation: { type: String, required: true },
  institution: { type: String, required: true },
  department:  { type: String, required: true },
  tshirt:      { type: String, enum: ['S','M','L','XL','XXL'], required: true },
  photoUrl:    { type: String, required: true },
}, { _id: false });

const ProjectSchema = new Schema({
  title:   { type: String, required: true },
  pitch:   { type: String, required: true },
  problem: { type: String, required: true },
  stack:   { type: String, required: true },
}, { _id: false });

const PaymentSchema = new Schema({
  method:       { type: String, enum: ['bkash','nagad','card'], required: true },
  amount:       { type: Number, required: true },
  currency:     { type: String, default: 'BDT' },
  status:       { type: String, enum: ['pending','paid','failed','cancelled','refunded'], default: 'pending', index: true },
  tranId:       { type: String, index: true },     // our transaction id
  valId:        { type: String },                  // sslcz val_id
  bankTranId:   { type: String },
  cardType:     { type: String },
  paidAt:       { type: Date },
  raw:          { type: Schema.Types.Mixed },      // IPN payload for audit
}, { _id: false });

const RegistrationSchema = new Schema({
  code:        { type: String, unique: true, index: true },      // e.g. IUPC-AB12CD
  event:       { type: String, enum: ['iupc','ctf','hackathon'], required: true, index: true },
  teamName:    { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  teamSize:    { type: Number, required: true, min: 1, max: 5 },
  leader: {
    fullName: { type: String, required: true },
    email:    { type: String, required: true, lowercase: true },
    phone:    { type: String, required: true },
  },
  members: { type: [MemberSchema], validate: v => v.length >= 1 && v.length <= 5 },
  coach:   { type: CoachSchema, default: undefined },
  project: { type: ProjectSchema, default: undefined },
  agreements: {
    rules: { type: Boolean, required: true },
    info:  { type: Boolean, required: true },
    media: { type: Boolean, required: true },
  },
  payment: { type: PaymentSchema, required: true },
  status:  { type: String, enum: ['draft','submitted','confirmed','cancelled'], default: 'submitted', index: true },
}, { timestamps: true });

RegistrationSchema.index({ event: 1, createdAt: -1 });
RegistrationSchema.index({ 'leader.email': 1 });

module.exports = model('Registration', RegistrationSchema);
```

### API endpoints (Phase 1 scope)

Base URL: `/api`. All responses `{ ok: boolean, data?, error? }`.

#### Health


| Method | Path      | Purpose        | Request | Response                      |
| ------ | --------- | -------------- | ------- | ----------------------------- |
| GET    | `/health` | Liveness probe | —       | `{ok:true, data:{uptime,ts}}` |


#### Uploads


| Method | Path               | Purpose              | Request (multipart)              | Response                          |
| ------ | ------------------ | -------------------- | -------------------------------- | --------------------------------- |
| POST   | `/uploads/id-card` | Upload ID-card image | field `file` (jpg/png/webp ≤2MB) | `{ok:true, data:{url, publicId}}` |
| POST   | `/uploads/coach`   | Upload coach photo   | field `file`                     | `{ok:true, data:{url, publicId}}` |


#### Registration


| Method | Path                   | Purpose                                                       | Request body / query                                | Response                                                     |
| ------ | ---------------------- | ------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| POST   | `/registrations`       | Create a registration (status `submitted`, payment `pending`) | See "Create Registration payload" below             | `{ok:true, data:{id, code, amount}}`                         |
| GET    | `/registrations`       | List registrations (admin)                                    | Query: `event`, `status`, `q`, `page=1`, `limit=20` | `{ok:true, data:{items:[Registration], total, page, limit}}` |
| GET    | `/registrations/:code` | Fetch single by code                                          | —                                                   | `{ok:true, data:Registration}`                               |


Create Registration request body:

```json
{
  "event": "iupc",
  "teamName": "Byte Force",
  "institution": "BUP",
  "teamSize": 3,
  "leader": { "fullName":"...", "email":"...", "phone":"+8801..." },
  "members": [ { "fullName":"...", "email":"...", "phone":"...", "institution":"...", "department":"...", "year":"3rd", "tshirt":"L", "idNumber":"...", "idCardUrl":"https://res.cloudinary.com/..." } ],
  "coach":   { "fullName":"...", "designation":"...", "institution":"...", "department":"...", "tshirt":"L", "photoUrl":"..." },
  "project": { "title":"...", "pitch":"...", "problem":"...", "stack":"..." },
  "agreements": { "rules": true, "info": true, "media": true },
  "payMethod": "bkash"
}
```

Validation errors return `422 {ok:false, error:{code:'VALIDATION', fields:{...}}}`.

#### Payments (SSLCommerz)


| Method | Path                      | Purpose                                                  | Request                | Response                                                    |
| ------ | ------------------------- | -------------------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| POST   | `/payments/sslcz/init`    | Create SSLCz session for a registration                  | `{ registrationCode }` | `{ok:true, data:{gatewayUrl, tranId}}`                      |
| POST   | `/payments/sslcz/ipn`     | SSLCz server-to-server IPN (verify signature, mark paid) | SSLCz form data        | `200 OK` plain                                              |
| POST   | `/payments/sslcz/success` | Browser return on success (303 redirect to frontend)     | SSLCz form data        | `303` → `${CLIENT_URL}/{event}?payment=success&tran_id=...` |
| POST   | `/payments/sslcz/fail`    | Browser return on fail                                   | SSLCz form data        | `303` → `?payment=fail`                                     |
| POST   | `/payments/sslcz/cancel`  | Browser return on cancel                                 | SSLCz form data        | `303` → `?payment=cancel`                                   |
| GET    | `/payments/:tranId`       | Poll payment status (frontend fallback)                  | —                      | `{ok:true, data:{status, code}}`                            |


Rate limit: `/registrations` POST → 10/min/IP; `/uploads/*` → 20/min/IP; IPN excluded.

### Backend build steps

1. Scaffold `apps/api` with Express 5, connect Mongo, mount modules, global error handler, `helmet`, `cors` (origin = `CLIENT_URL`), `morgan`, `compression`.
2. Implement `upload` module (Multer memory storage → Cloudinary `upload_stream`, validate mime/size).
3. Implement `registration` module (validator → service → controller → routes). Generate `code` via `nanoid(6)` prefixed by event key.
4. Implement `payment` module: init calls SSLCz sandbox `session/init`; IPN verifies `verify_sign` (MD5 over sorted keys + md5(store_passwd)); on `VALID`/`VALIDATED`, mark registration `payment.status='paid'`, `status='confirmed'`, send receipt email via Nodemailer.
5. Wire frontend: replace prototype's `initSslczSession` with API client calls. Payment return page reads `?payment=` and calls `GET /payments/:tranId` to reconcile.
6. Manual QA against SSLCz sandbox end-to-end for all three events.

Deploy backend to Render (Node service, auto-deploy from `main`). Set env vars in dashboard. Point Vercel `VITE_API_URL` to Render URL. Configure SSLCz callback URLs to `${API_URL}/api/payments/sslcz/{success,fail,cancel,ipn}`.

---

## Phase 4 — Deployment & Ops (Phase 1 cutover)

- Vercel project for `apps/web` (Root Directory `apps/web`, build `pnpm build`, output `dist`).
- Render Web Service for `apps/api` (Root `apps/api`, build `pnpm install`, start `node src/server.js`).
- MongoDB Atlas M0, IP allowlist `0.0.0.0/0` for Render, restricted user.
- Cloudinary unsigned preset for direct uploads OR signed uploads through API (recommended).
- UptimeRobot ping on `/api/health`.
- Sentry (optional) on both apps.
- Backups: Atlas daily snapshots; export CSV of registrations from admin (Phase 2).

---

## Phase 5+ — Deferred (implement later, not now)

Auth (JWT + refresh) & admin panel; email templates & broadcast; team CRUD by leader; judging & scoring; CMS for sponsors/tracks; analytics; CTF platform integration; realtime leaderboard (Socket.IO); PWA; i18n; testing pyramid; CDN/image transforms; observability (pino + Logtail).

---

## Risks & mitigations

- No TS → catch class of bugs with ESLint rules + hand-rolled validators + Jest tests on services.
- No Zod now → make validators return structured errors so swapping in Zod later is a drop-in.
- SSLCz sandbox differences → keep `raw` IPN payload for audit; add a manual "mark paid" admin endpoint later.
- Cloudinary quota → cap file size 2MB, transform to webp on upload.

Don't start implementation right now. I will ask you