import type { EventConfig } from "../types";

export const ctfConfig: EventConfig = {
  key: "ctf",
  eventName: "CTF 2026",
  eventLabel: "CTF 2026",
  feePerPerson: 500,
  team: {
    kind: "chooser",
    heading: "How are you playing?",
    sub: "CTF teams can be 1 to 4 hackers. Pick your setup — you can change this later.",
    options: [
      { n: 1, title: "Solo hacker", desc: "Fly solo — one keyboard, every category.", tag: "Just me" },
      { n: 2, title: "Duo", desc: "Two-person crew. Split web and pwn.", tag: "2 members" },
      { n: 3, title: "Trio", desc: "Balanced squad across crypto, rev, forensics.", tag: "3 members" },
      { n: 4, title: "Full squad", desc: "Maximum team size — cover every category.", tag: "4 members" },
    ],
  },
  memberExtras: { discord: true },
  soloBadge: "Solo hacker",
  soloIntro:
    "You're playing solo — one form, one hacker. This info doubles as your team leader record.",
  teamStepHeading: "Team details",
  teamStepDesc: (n) => `Register your CTF crew — a team of ${n} hackers.`,
  membersHeading: () => "Team members",
  membersDesc: (n) => `Fill in details for all ${n} hackers.`,
  teamNamePlaceholder: "e.g. Segfault Syndicate",
  rulesAgree:
    'I confirm all team members agree to the <strong>CTF rules &amp; code of conduct</strong>, including no flag sharing between teams and organizer decisions being final.',
  successSubject: "CTF",
  successHint: "check-in",
  codePrefix: "CTF-",
  fallbackTranCode: "CTF-CONFIRMED",
  emailContact: "ctf@bupcsecarnival.dev",
  formatLabel: "Jeopardy · 8 hrs",
};
