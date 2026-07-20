import type { EventConfig } from "../types";

export const iupcConfig: EventConfig = {
  key: "iupc",
  eventName: "IUPC 2026",
  eventLabel: "IUPC 2026",
  feePerPerson: 500,
  team: { kind: "fixed", size: 3, badge: "Fixed · 3 students + 1 coach" },
  coach: true,
  soloBadge: "Solo hacker",
  soloIntro: "",
  teamStepHeading: "Team details",
  teamStepDesc: (n) =>
    `Register your IUPC squad — a fixed team of ${n} students plus one coach.`,
  membersHeading: () => "Team members",
  membersDesc: (n) => `Fill in details for all ${n} contestants.`,
  teamNamePlaceholder: "e.g. Binary Brigade",
  rulesAgree:
    'I confirm all team members agree to the <strong>contest rules &amp; code of conduct</strong>, including ACM-ICPC fair-play policies and organizer decisions being final.',
  successSubject: "IUPC",
  successHint: "the pre-contest briefing",
  codePrefix: "IUPC-",
  fallbackTranCode: "IUPC-CONFIRMED",
  emailContact: "iupc@bupcsecarnival.dev",
  formatLabel: "ACM-ICPC",
};
