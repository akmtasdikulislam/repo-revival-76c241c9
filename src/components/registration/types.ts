import type { ComponentType } from "react";
import {
  IconUsers,
  IconUser,
  IconClipboardCheck,
  IconCreditCard,
  IconBulb,
  IconChalkboard,
} from "@tabler/icons-react";

export type Member = {
  idCard: string;
  idNumber: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  year: string;
  tshirt: string;
  discord?: string;
  role?: string;
};

export type Coach = {
  photo: string;
  fullName: string;
  designation: string;
  institution: string;
  department: string;
  tshirt: string;
};

export type Project = {
  title: string;
  pitch: string;
  problem: string;
  stack: string;
};

export type StepId =
  | "team"
  | "solo"
  | "members"
  | "coach"
  | "project"
  | "review"
  | "payment";

type IconType = ComponentType<{ size?: number; strokeWidth?: number }>;

export const STEP_META: Record<StepId, { label: string; Icon: IconType }> = {
  team: { label: "Team", Icon: IconUsers },
  solo: { label: "You", Icon: IconUser },
  members: { label: "Members", Icon: IconUser },
  coach: { label: "Coach", Icon: IconChalkboard },
  project: { label: "Project", Icon: IconBulb },
  review: { label: "Review", Icon: IconClipboardCheck },
  payment: { label: "Payment", Icon: IconCreditCard },
};

export type TeamSizeOption = {
  n: number;
  title: string;
  desc: string;
  tag: string;
};

export type EventKey = "iupc" | "ctf" | "hackathon";

export type EventConfig = {
  key: EventKey;
  eventName: string;              // e.g. "IUPC 2026"
  feePerPerson: number;

  /** Team sizing */
  team:
    | { kind: "fixed"; size: number; badge: string }
    | {
        kind: "chooser";
        heading: string;
        sub: string;
        options: TeamSizeOption[];
      };

  /** Optional extra steps */
  coach?: boolean;
  project?: boolean;

  /** Optional per-member fields */
  memberExtras?: {
    discord?: boolean;
    role?: boolean;
  };

  /** Copy */
  soloBadge: string;              // "Solo hacker" | "Solo builder"
  soloIntro: string;              // sub-text on StepSolo
  teamStepHeading: string;        // solo-aware fallback for team-size==1
  teamStepDesc: (size: number) => string;
  membersHeading: (count: number) => string;
  membersDesc: (count: number) => string;
  teamNamePlaceholder: string;
  rulesAgree: string;
  successSubject: string;         // "IUPC" | "CTF" | "Hackathon"
  successHint: string;
  codePrefix: string;             // "IUPC-" | "CTF-" | "HACK-"
  fallbackTranCode: string;       // "IUPC-CONFIRMED" etc.
  emailContact: string;
  formatLabel: string;            // shown in summary aside
  eventLabel: string;             // e.g. "IUPC 2026"
};

export type ErrFn = (k: string) => string | undefined;
export type TouchFn = (k: string) => void;
