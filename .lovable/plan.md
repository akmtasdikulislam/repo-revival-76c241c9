# Cleanup Plan — Delete Unused Files & Dependencies

Audit results (verified with ripgrep across `src/`):

- **`src/components/ui/` (44 files)** — zero imports from anywhere in the app. The shadcn components only reference each other; nothing in `routes/`, `components/{layout,home,event,registration,id-card}`, or `lib/` pulls them in. Safe to remove wholesale.
- **`src/hooks/use-mobile.tsx`** — only consumer is `ui/sidebar.tsx`. Goes with the `ui/` deletion. The empty `src/hooks/` folder is removed too.
- **`.lovable/plan.md`** — stale naming-refactor plan from a completed phase; not referenced by any code or tooling.
- **`components.json`** — shadcn CLI config; unused once `ui/` is gone.
- **npm packages** pulled in only by `ui/` files (unused after the delete):
  `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, plus every `@radix-ui/*` package, `class-variance-authority`, `next-themes` (if present). Kept: `clsx`, `tailwind-merge`, `lucide-react`, `@tabler/icons-react`, `framer-motion`, `@leenguyen/react-flip-clock-countdown`, `react-easy-crop`, `zod`, Tanstack + Tailwind + Vite toolchain.

**Explicitly kept** (verified in use):
- All 4 `src/assets/*.asset.json` — imported by `src/data/gallery.ts`.
- All `src/lib/errors/*` — imported by `__root.tsx`, `start.ts`, `server.ts`.
- `src/lib/{seo,image-crop,utils,sslcommerz.functions}.ts` — all referenced.
- `AGENTS.md`, `.prettierrc`, `.prettierignore`, `bunfig.toml`, `eslint.config.js`, `tsconfig.json`, `vite.config.ts` — tooling.
- `public/{favicon.ico,robots.txt}`.

## Execution steps

1. **Delete `src/components/ui/`** (whole folder) and **`src/hooks/`** (whole folder).
2. **Delete `.lovable/plan.md`** and **`components.json`**.
3. **Remove unused packages** with a single `bun remove` covering the list above. Confirm each is genuinely orphan by re-running `rg` on the package name across `src/` immediately before removal; skip any that still show a hit.
4. **Verify**: `bunx tsgo --noEmit` + `bun run build`, then Playwright-screenshot `/`, `/iupc`, `/ctf`, `/hackathon`, `/faq`, `/gallery` at 1280×1800 to confirm the UI is byte-identical to before.

## Risks & mitigations

- **A `ui/` component turns out to be used** → the pre-step `rg` sweep already showed zero hits outside `ui/`; the tsgo/build in step 4 catches any missed reference before the change ships.
- **A package is imported transitively by kept code** → step-3 per-package `rg` verification prevents removing anything still referenced.
- **Nothing else in the tree looks removable** — routes, data files, layout, event/home/registration components, and error utilities are all reachable from a route.

Approve to run steps 1–4 in order.