export const NAV_ITEMS = [
  { to: "/iupc", label: "IUPC" },
  { to: "/ctf", label: "CTF" },
  { to: "/hackathon", label: "Hackathon" },
  { to: "/gallery", label: "Gallery" },
  { to: "/faq", label: "FAQ" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
