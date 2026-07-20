import type { EventConfig } from "../types";

export const hackathonConfig: EventConfig = {
  key: "hackathon",
  eventName: "Hackathon 2026",
  eventLabel: "Hackathon 2026",
  feePerPerson: 500,
  team: {
    kind: "chooser",
    heading: "How are you joining?",
    sub: "Hackathon teams can be 1 to 4 builders. Pick your setup — you can change this later.",
    options: [
      { n: 1, title: "Solo builder", desc: "Ship it alone — one hacker, one machine.", tag: "Just me" },
      { n: 2, title: "Duo", desc: "Two-person team. Pair-programming energy.", tag: "2 members" },
      { n: 3, title: "Trio", desc: "Balanced squad for full-stack builds.", tag: "3 members" },
      { n: 4, title: "Full squad", desc: "Maximum team size — go all in.", tag: "4 members" },
    ],
  },
  project: true,
  memberExtras: { role: true },
  soloBadge: "Solo builder",
  soloIntro:
    "You're registering solo — one form, one builder. This info doubles as your team leader record.",
  teamStepHeading: "Team details",
  teamStepDesc: (n) =>
    `Register your hackathon squad — a team of ${n} builders.`,
  membersHeading: (n) => (n === 1 ? "Your details" : "Team members"),
  membersDesc: (n) =>
    n === 1 ? "Fill in your builder profile." : `Fill in details for all ${n} builders.`,
  teamNamePlaceholder: "e.g. Kernel Panic",
  rulesAgree:
    'I confirm all team members agree to the <strong>hackathon rules &amp; code of conduct</strong>, including originality of work and organizer decisions being final.',
  successSubject: "Hackathon",
  successHint: "kickoff check-in",
  codePrefix: "HACK-",
  fallbackTranCode: "HACK-CONFIRMED",
  emailContact: "hackathon@bupcsecarnival.dev",
  formatLabel: "24-hour sprint",
};
