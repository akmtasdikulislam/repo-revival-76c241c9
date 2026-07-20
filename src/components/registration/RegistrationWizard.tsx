import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconCreditCard } from "@tabler/icons-react";
import { initSslczSession } from "@/lib/sslcommerz.functions";
import {
  StepBar,
  FeeBanner,
  SummaryAside,
  SuccessPanel,
  TeamSizeChooser,
  digits,
  emailRe,
  filterInstitutions,
  type SummaryAsideRow,
} from "./wizard-fields";
import {
  StepTeam,
  StepMembers,
  StepSolo,
  StepCoach,
  StepProject,
  StepReview,
  StepPayment,
} from "./wizard-steps";
import type {
  EventConfig,
  Member,
  Coach,
  Project,
  StepId,
} from "./types";

const emptyMember = (institution = ""): Member => ({
  idCard: "",
  idNumber: "",
  fullName: "",
  email: "",
  phone: "",
  institution,
  department: "",
  year: "",
  tshirt: "",
  discord: "",
  role: "",
});

const emptyCoach = (institution = ""): Coach => ({
  photo: "",
  fullName: "",
  designation: "",
  institution,
  department: "",
  tshirt: "",
});

const emptyProject = (): Project => ({
  title: "",
  pitch: "",
  problem: "",
  stack: "",
});

export function RegistrationWizard({ cfg }: { cfg: EventConfig }) {
  const chooser = cfg.team.kind === "chooser";
  const initialSize = cfg.team.kind === "fixed" ? cfg.team.size : null;
  const [teamSize, setTeamSize] = useState<number | null>(initialSize);
  const isSolo = teamSize === 1;

  const flow: StepId[] = useMemo(() => {
    if (teamSize === null) return [];
    const arr: StepId[] = [];
    if (isSolo) arr.push("solo");
    else arr.push("team", "members");
    if (cfg.coach) arr.push("coach");
    if (cfg.project) arr.push("project");
    arr.push("review", "payment");
    return arr;
  }, [isSolo, teamSize, cfg.coach, cfg.project]);

  const fee = cfg.feePerPerson * (teamSize ?? 0);

  const [step, setStep] = useState(0);
  const current: StepId | undefined = flow[step];

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));
  const touchAll = (keys: string[]) =>
    setTouched((t) => keys.reduce((acc, k) => ({ ...acc, [k]: true }), t));

  const [teamName, setTeamName] = useState("");
  const [institution, setInstitution] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [instSuggest, setInstSuggest] = useState<string[]>([]);

  const [members, setMembers] = useState<Member[]>(() =>
    initialSize ? Array.from({ length: initialSize }, () => emptyMember()) : [],
  );
  const [coach, setCoach] = useState<Coach>(() => emptyCoach());
  const [project, setProject] = useState<Project>(() => emptyProject());

  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeInfo, setAgreeInfo] = useState(false);
  const [agreeMedia, setAgreeMedia] = useState(false);

  const [payMethod, setPayMethod] = useState<"bkash" | "nagad" | "card">("bkash");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const teamCodeRef = useRef<string>("");
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const status = p.get("payment");
    if (!status) return;
    if (status === "success") {
      teamCodeRef.current = p.get("tran_id") || cfg.fallbackTranCode;
      setDone(true);
    }
    const url = window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", url);
  }, [cfg.fallbackTranCode]);

  function chooseTeamSize(n: number) {
    setTeamSize(n);
    setMembers(Array.from({ length: n }, () => emptyMember()));
    setStep(0);
  }

  const setMember = (i: number, patch: Partial<Member>) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const setSoloMember = (patch: Partial<Member>) => {
    setMembers((prev) => {
      const next = [{ ...prev[0], ...patch }];
      if (patch.email !== undefined) setLeaderEmail(patch.email);
      if (patch.phone !== undefined) setLeaderPhone(patch.phone);
      if (patch.institution !== undefined) setInstitution(patch.institution);
      if (patch.fullName !== undefined && !teamName.trim()) setTeamName(patch.fullName);
      return next;
    });
  };

  function onInstitutionInput(v: string) {
    const prev = institution;
    setInstitution(v);
    setMembers((ms) =>
      ms.map((m) =>
        m.institution === "" || m.institution === prev ? { ...m, institution: v } : m,
      ),
    );
    if (cfg.coach) {
      setCoach((c) =>
        c.institution === "" || c.institution === prev ? { ...c, institution: v } : c,
      );
    }
    setInstSuggest(filterInstitutions(v));
  }

  function pickInstitution(v: string) {
    const prev = institution;
    setMembers((ms) =>
      ms.map((m) =>
        m.institution === "" || m.institution === prev ? { ...m, institution: v } : m,
      ),
    );
    if (cfg.coach) {
      setCoach((c) =>
        c.institution === "" || c.institution === prev ? { ...c, institution: v } : c,
      );
    }
    setInstitution(v);
    setInstSuggest([]);
  }

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!isSolo) {
      if (!teamName.trim()) e["teamName"] = "Team name is required";
      if (!institution.trim()) e["institution"] = "Institution is required";
      if (!leaderName.trim()) e["leaderName"] = "Leader name is required";
      if (!emailRe.test(leaderEmail)) e["leaderEmail"] = "Enter a valid email";
      if (digits(leaderPhone).length < 10) e["leaderPhone"] = "Enter a valid phone";
    }
    members.forEach((m, i) => {
      const p = `m${i}.`;
      if (!m.idCard) e[p + "idCard"] = "ID card photo required";
      if (!m.idNumber.trim()) e[p + "idNumber"] = "ID number required";
      if (!m.fullName.trim()) e[p + "fullName"] = "Full name required";
      if (!emailRe.test(m.email)) e[p + "email"] = "Valid email required";
      if (digits(m.phone).length < 10) e[p + "phone"] = "Valid phone required";
      if (!m.institution.trim()) e[p + "institution"] = "Institution required";
      if (!m.department.trim()) e[p + "department"] = "Department required";
      if (!m.year) e[p + "year"] = "Select year";
      if (cfg.memberExtras?.discord && !(m.discord ?? "").trim())
        e[p + "discord"] = "Discord username required";
      if (cfg.memberExtras?.role && !m.role) e[p + "role"] = "Select role";
      if (!m.tshirt) e[p + "tshirt"] = "Select size";
    });
    if (cfg.coach) {
      if (!coach.photo) e["c.photo"] = "Photo required";
      if (!coach.fullName.trim()) e["c.fullName"] = "Coach name required";
      if (!coach.designation.trim()) e["c.designation"] = "Designation required";
      if (!coach.institution.trim()) e["c.institution"] = "Institution required";
      if (!coach.department.trim()) e["c.department"] = "Department required";
      if (!coach.tshirt) e["c.tshirt"] = "Select size";
    }
    if (cfg.project) {
      if (!project.title.trim()) e["p.title"] = "Working title required";
      if (project.pitch.trim().length < 40)
        e["p.pitch"] = "Give at least a short paragraph (40+ chars)";
      if (project.problem.trim().length < 20)
        e["p.problem"] = "Describe the problem (20+ chars)";
      if (!project.stack.trim()) e["p.stack"] = "List your tech stack";
    }
    return e;
  }, [
    cfg.coach,
    cfg.project,
    cfg.memberExtras,
    isSolo,
    teamName,
    institution,
    leaderName,
    leaderEmail,
    leaderPhone,
    members,
    coach,
    project,
  ]);

  const memberKeys = (i: number) => {
    const ks = [
      "idCard",
      "idNumber",
      "fullName",
      "email",
      "phone",
      "institution",
      "department",
      "year",
      "tshirt",
    ];
    if (cfg.memberExtras?.discord) ks.push("discord");
    if (cfg.memberExtras?.role) ks.push("role");
    return ks.map((k) => `m${i}.${k}`);
  };

  const stepKeys = (id: StepId): string[] => {
    if (id === "team")
      return ["teamName", "institution", "leaderName", "leaderEmail", "leaderPhone"];
    if (id === "members") return members.flatMap((_, i) => memberKeys(i));
    if (id === "solo") return memberKeys(0);
    if (id === "coach")
      return ["c.photo", "c.fullName", "c.designation", "c.institution", "c.department", "c.tshirt"];
    if (id === "project") return ["p.title", "p.pitch", "p.problem", "p.stack"];
    return [];
  };

  const stepHasErrors = (id: StepId) => stepKeys(id).some((k) => errors[k]);
  const err = (k: string) => (touched[k] ? errors[k] : undefined);

  function syncLeaderToFirstMember() {
    setMembers((prev) => {
      if (prev.length === 0) return prev;
      const first = prev[0];
      return [
        {
          ...first,
          fullName: leaderName || first.fullName,
          email: leaderEmail || first.email,
          phone: leaderPhone || first.phone,
          institution: institution || first.institution,
        },
        ...prev.slice(1),
      ];
    });
  }

  function next() {
    if (!current) return;
    if (stepHasErrors(current)) {
      touchAll(stepKeys(current));
      return;
    }
    if (current === "team") syncLeaderToFirstMember();
    if (current === "review" && !(agreeRules && agreeInfo && agreeMedia)) return;
    setStep((s) => Math.min(flow.length - 1, s + 1));
  }
  const back = () => setStep((s) => Math.max(0, s - 1));

  async function handlePay() {
    setSubmitting(true);
    setPayError(null);
    const localCode =
      cfg.codePrefix + Math.random().toString(36).slice(2, 8).toUpperCase();
    teamCodeRef.current = localCode;
    try {
      const key = "bcc_registrations_pending";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({
        id: localCode,
        event: cfg.key,
        teamName,
        institution,
        leaderEmail,
        leaderPhone,
        members,
        ...(cfg.coach ? { coach } : {}),
        ...(cfg.project ? { project } : {}),
        payMethod,
        fee,
        createdAt: Date.now(),
      });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* ignore */
    }
    try {
      const { gatewayUrl } = await initSslczSession({
        data: {
          amount: fee,
          teamName,
          institution,
          leaderEmail,
          leaderPhone: "+880" + digits(leaderPhone),
          event: cfg.key,
        },
      });
      if (window.top && window.top !== window.self) {
        try {
          window.top.location.href = gatewayUrl;
        } catch {
          window.open(gatewayUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        window.location.href = gatewayUrl;
      }
    } catch (e) {
      setSubmitting(false);
      setPayError(e instanceof Error ? e.message : "Payment initiation failed");
    }
  }

  if (chooser && teamSize === null && !done && cfg.team.kind === "chooser") {
    return (
      <TeamSizeChooser
        heading={cfg.team.heading}
        sub={cfg.team.sub}
        options={cfg.team.options}
        feePerPerson={cfg.feePerPerson}
        onPick={chooseTeamSize}
      />
    );
  }

  const size = teamSize ?? 1;
  const filled = members.filter((m) => m.fullName.trim()).length;

  const summaryRows: SummaryAsideRow[] = [
    { label: "Event", value: cfg.eventLabel },
    { label: "Team", value: teamName || "—" },
    { label: "Institution", value: institution || "—" },
    { label: "Members", value: `${filled}/${teamSize ?? 0}` },
  ];
  if (cfg.coach) summaryRows.push({ label: "Coach", value: coach.fullName ? "✓" : "—" });
  if (cfg.project)
    summaryRows.push({ label: "Project", value: project.title || "—" });
  summaryRows.push({ label: "Format", value: cfg.formatLabel });

  return (
    <div className="wizard-wrap">
      <div>
        <StepBar flow={flow} stepIndex={step} />
        <div className="wizard-card">
          <FeeBanner
            feePerPerson={cfg.feePerPerson}
            teamSize={size ?? 1}
            total={fee}
            isSolo={isSolo}
            soloLabel={cfg.soloBadge}
          />
          <AnimatePresence mode="wait">
            {done ? (
              <SuccessPanel
                key="done"
                code={teamCodeRef.current}
                teamName={teamName || members[0]?.fullName || ""}
                subject={cfg.successSubject}
                hint={cfg.successHint}
              />
            ) : current === "team" ? (
              <StepTeam
                key="team"
                cfg={cfg}
                teamSize={size ?? 1}
                onChangeTeamSize={chooser ? () => setTeamSize(null) : undefined}
                teamName={teamName}
                setTeamName={setTeamName}
                institution={institution}
                onInstitutionInput={onInstitutionInput}
                instSuggest={instSuggest}
                setInstSuggest={setInstSuggest}
                pickInstitution={pickInstitution}
                leaderName={leaderName}
                setLeaderName={setLeaderName}
                leaderEmail={leaderEmail}
                setLeaderEmail={setLeaderEmail}
                leaderPhone={leaderPhone}
                setLeaderPhone={setLeaderPhone}
                err={err}
                touch={touch}
              />
            ) : current === "members" ? (
              <StepMembers
                key="members"
                cfg={cfg}
                members={members}
                setMember={setMember}
                err={err}
                touch={touch}
              />
            ) : current === "solo" ? (
              <StepSolo
                key="solo"
                cfg={cfg}
                member={members[0]}
                setMember={setSoloMember}
                onChangeTeamSize={() => setTeamSize(null)}
                instSuggest={instSuggest}
                setInstSuggest={setInstSuggest}
                onInstitutionInput={(v) => {
                  setSoloMember({ institution: v });
                  setInstSuggest(filterInstitutions(v));
                }}
                pickInstitution={(v) => {
                  setSoloMember({ institution: v });
                  setInstSuggest([]);
                }}
                err={err}
                touch={touch}
              />
            ) : current === "coach" ? (
              <StepCoach
                key="coach"
                coach={coach}
                setCoach={(patch) => setCoach((c) => ({ ...c, ...patch }))}
                err={err}
                touch={touch}
              />
            ) : current === "project" ? (
              <StepProject
                key="project"
                project={project}
                setProject={(patch) => setProject((p) => ({ ...p, ...patch }))}
                err={err}
                touch={touch}
              />
            ) : current === "review" ? (
              <StepReview
                key="review"
                cfg={cfg}
                isSolo={isSolo}
                teamName={teamName}
                institution={institution}
                leaderName={leaderName}
                leaderEmail={leaderEmail}
                leaderPhone={leaderPhone}
                members={members}
                coach={cfg.coach ? coach : undefined}
                project={cfg.project ? project : undefined}
                agreeRules={agreeRules}
                setAgreeRules={setAgreeRules}
                agreeInfo={agreeInfo}
                setAgreeInfo={setAgreeInfo}
                agreeMedia={agreeMedia}
                setAgreeMedia={setAgreeMedia}
              />
            ) : (
              <StepPayment
                key="payment"
                payMethod={payMethod}
                setPayMethod={setPayMethod}
                submitting={submitting}
                onPay={handlePay}
                fee={fee}
              />
            )}
          </AnimatePresence>

          {!done && (
            <div className="wizard-nav">
              <button
                type="button"
                className="wizard-btn ghost"
                onClick={back}
                disabled={step === 0}
              >
                <IconArrowLeft size={14} /> Back
              </button>
              {current !== "payment" && (
                <button
                  type="button"
                  className="wizard-btn primary"
                  onClick={next}
                  disabled={
                    current === "review" && !(agreeRules && agreeInfo && agreeMedia)
                  }
                >
                  {current === "review" ? "Continue to payment" : "Continue"}
                  <IconArrowRight size={14} />
                </button>
              )}
              {current === "payment" && (
                <button
                  type="button"
                  className="wizard-btn mint"
                  onClick={handlePay}
                  disabled={submitting}
                >
                  {submitting ? "Processing…" : `Pay ৳${fee}`}
                  <IconCreditCard size={14} />
                </button>
              )}
            </div>
          )}
          {payError && (
            <p style={{ color: "var(--color-cn-coral)", fontSize: 13, marginTop: 12 }}>
              Payment error: {payError}
            </p>
          )}
        </div>

        <div className="wizard-side-notes">
          <div className="wizard-note-box">
            <h6>Secure checkout</h6>
            <p>
              Payment gateway integrates on submit — bKash, Nagad, cards. No card data
              ever touches our servers.
            </p>
          </div>
          <div className="wizard-note-box">
            <h6>Need help?</h6>
            <p>
              Email <a href={`mailto:${cfg.emailContact}`}>{cfg.emailContact}</a> or
              reach the ops desk on the segment page.
            </p>
          </div>
        </div>
      </div>

      <SummaryAside rows={summaryRows} fee={fee} />
    </div>
  );
}
