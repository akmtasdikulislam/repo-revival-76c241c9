import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { IconBrandGithub, IconBell } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./nav-items";

const navLinkBase =
  "text-[11px] uppercase tracking-[0.14em] text-cn-ink-dim transition-colors duration-200 hover:text-cn-cyan";


export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed noise + scanline overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.05]"
        style={{
          background:
            "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px)",
        }}
      />

      <motion.nav
        id="nav"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={[
          "fixed inset-x-0 top-0 z-[100] flex w-full items-center justify-between",
          "px-8 py-4 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-400",
          scrolled
            ? "border-b border-white/[0.08] bg-[rgb(8_21_54/0.55)] shadow-[var(--shadow-nav-glass)] backdrop-blur-[18px] backdrop-saturate-[160%]"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[13px] font-bold tracking-[0.04em]"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-cn-mint shadow-[0_0_8px_var(--color-cn-mint)]" />
          BUP<span className="text-cn-gold">_</span>CSE
          <span className="text-cn-gold">.</span>CARNIVAL
        </Link>

        <ul className="flex gap-[26px]">
          {NAV_ITEMS.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className={
                  navLinkBase +
                  (pathname === n.to ? " !text-cn-gold" : "")
                }
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-cn-strong bg-white/[0.035] px-3 text-cn-cyan transition-all duration-200 hover:-translate-y-0.5 hover:border-cn-cyan hover:bg-[rgb(53_208_224/0.07)]"
          >
            <IconBell size={18} />
          </button>
          <Link
            to="/"
            hash="tracks"
            className="inline-block rounded-full bg-cn-gold px-[18px] py-[9px] text-[11px] font-bold uppercase tracking-[0.08em] text-cn-primary-dark shadow-[var(--shadow-glow-gold)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffcb2e]"
          >
            register →
          </Link>
        </div>
      </motion.nav>

      {children}

      <footer className="relative z-[1] bg-cn-primary-dark px-6 pt-12 pb-6 text-cn-ink">
        <div className="mx-auto mb-8 flex max-w-[1100px] flex-wrap justify-between gap-5 border-b border-white/[0.12] pb-7">
          <div>
            <span className="text-sm font-bold tracking-[0.04em]">
              BUP<span className="text-cn-gold">_</span>CSE
              <span className="text-cn-gold">.</span>CARNIVAL
            </span>
            <span className="mt-1.5 block text-[11px] opacity-60">
              Organized by BUP CSE Society
            </span>
          </div>
          <ul className="flex flex-wrap gap-[22px]">
            {NAV_ITEMS.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-[11px] uppercase tracking-[0.12em] opacity-70 transition-opacity hover:opacity-100 hover:text-cn-cyan"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-2.5 text-[11px] opacity-60">
          <span>© 2026 BUP CSE Tech Carnival — All rights reserved</span>
          <span className="flex items-center gap-2">
            <IconBrandGithub size={14} className="align-middle" /> Built with React
            · Tailwind · TanStack
          </span>
        </div>
      </footer>
    </>
  );
}
