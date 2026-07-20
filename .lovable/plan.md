## Status check

Phase 1 JSX work is already complete:
- `SiteLayout.tsx` renders nav, footer, and the noise/scanline overlays with Tailwind utilities + `@theme` tokens (no legacy classnames like `nav-glass`, `.noise`, `.scanlines`, `.footer-*`).
- `Reveal.tsx` is a plain framer-motion wrapper with no CSS dependency.

What's missing is the second half of every phase in the plan: **removing the matching CSS from `src/styles/carnival.css`**. Those rules are dead code today (nothing in JSX references them) but still ship.

## Goal

Delete the shared-chrome CSS from `src/styles/carnival.css` so Phase 1 is genuinely closed, without any visual change.

## Blocks to remove from `src/styles/carnival.css`

1. **Global base / reset** (~lines 1–98): `:root` token dump, `*`, `html`, `::selection`, `body`, `a`, `ul`, `em`, and the `::-webkit-scrollbar*` rules. Tokens already live in `src/styles.css` under `@theme`; the reset is covered by Tailwind Preflight + the small `@layer base` in `styles.css`.
2. **Ambient overlays** (~lines 100–138): `.noise`, `.scanlines`, `#bgCanvas`, and the `body::before` radial-gradient backdrop. The two overlays are re-implemented inline in `SiteLayout.tsx`; `#bgCanvas` and the body backdrop are unused (no JSX renders them).
3. **Nav chrome** (~lines 350–430): `.nav-logo`, `.nav-logo .dot`, `.nav-links`, `.nav-links a`, `.nav-links a:hover`, `.nav-links a.active`, `.nav-cta`, `.nav-cta:hover`, `.nav-burger`, `.nav-burger span`, plus any `#nav` / `.nav-glass` selectors in the same neighborhood.
4. **Footer chrome** (~lines 1107–1180): `footer`, `.footer-top`, `.footer-logo`, `.footer-org`, `.footer-links`, `.footer-links a`, `.footer-links a:hover`, `.footer-bottom`, `.footer-tag`. Leave the sponsor-footer block (`#site-footer`, `.footer-sponsors*`, ~lines 4206–4420) alone — that belongs to Phase 4 (Sponsors).
5. Any media-query fragments inside the Phase-1 line ranges above that only target the removed selectors.

Do **not** touch: base typography of section headers, `.section`, `.sec-hdr`, `.sec-num`, tracks, timeline, gallery, CTA, sponsors, wizard — those are future phases.

## Verification (required before closing Phase 1)

1. `rg -n "\.noise|\.scanlines|#bgCanvas|nav-logo|nav-links|nav-cta|nav-burger|footer-top|footer-logo|footer-links|footer-bottom|footer-tag" src/styles/carnival.css` → no matches.
2. `rg -n "nav-logo|nav-links|nav-cta|nav-burger|footer-top|footer-logo|footer-links|footer-bottom|footer-tag|\\bnoise\\b|scanlines|bgCanvas" src -g '!*.css'` → no JSX references (expected: empty).
3. Load `/` in the preview at 1280 wide via Playwright, screenshot the top (nav + hero overlays) and the bottom (footer). Compare against a screenshot captured before the deletion — pixel diff should be visually identical.
4. Line count: `src/styles/carnival.css` should drop from 8654 to roughly 8400–8450.

## Then

Once verified, proceed strictly to **Phase 2 — Home hero + Countdown** (hero grid, terminal card, CTA buttons, meta stats, `Countdown` flip-clock overrides) as the next planning turn.
