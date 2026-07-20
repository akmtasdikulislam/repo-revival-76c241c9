import { motion } from "framer-motion";
import { IconCamera } from "@tabler/icons-react";
import { IdCardUploader } from "@/components/id-card/IdCardUploader";
import {
  Field,
  PhoneInput,
  InstitutionField,
  fadeMotion,
  YEAR_OPTIONS,
  ROLE_OPTIONS,
  TSHIRT_SIZES,
} from "./wizard-fields";
import type { Member, Coach, Project, ErrFn, TouchFn, EventConfig } from "./types";

/* ---------------- StepTeam ---------------- */
export function StepTeam({
  cfg,
  teamSize,
  onChangeTeamSize,
  teamName,
  setTeamName,
  institution,
  onInstitutionInput,
  instSuggest,
  setInstSuggest,
  pickInstitution,
  leaderName,
  setLeaderName,
  leaderEmail,
  setLeaderEmail,
  leaderPhone,
  setLeaderPhone,
  err,
  touch,
}: {
  cfg: EventConfig;
  teamSize: number;
  onChangeTeamSize?: () => void;
  teamName: string;
  setTeamName: (v: string) => void;
  institution: string;
  onInstitutionInput: (v: string) => void;
  instSuggest: string[];
  setInstSuggest: (v: string[]) => void;
  pickInstitution: (v: string) => void;
  leaderName: string;
  setLeaderName: (v: string) => void;
  leaderEmail: string;
  setLeaderEmail: (v: string) => void;
  leaderPhone: string;
  setLeaderPhone: (v: string) => void;
  err: ErrFn;
  touch: TouchFn;
}) {
  const isFixed = cfg.team.kind === "fixed";
  return (
    <motion.div {...fadeMotion()}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>Team details</h3>
        {isFixed && cfg.team.kind === "fixed" && (
          <span className="wizard-badge">{cfg.team.badge}</span>
        )}
      </div>
      <p className="wizard-card-sub">{cfg.teamStepDesc(teamSize)}</p>

      <div className="wizard-grid cols-2">
        <Field label="Team name" error={err("teamName")}>
          <input
            type="text"
            placeholder={cfg.teamNamePlaceholder}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onBlur={() => touch("teamName")}
          />
        </Field>

        <InstitutionField
          value={institution}
          onInput={onInstitutionInput}
          onPick={pickInstitution}
          suggestions={instSuggest}
          setSuggestions={setInstSuggest}
          errorKey="institution"
          err={err}
          touch={touch}
        />

        <Field label="Leader name" error={err("leaderName")}>
          <input
            type="text"
            placeholder="Full name"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            onBlur={() => touch("leaderName")}
          />
        </Field>

        <Field label="Leader email" error={err("leaderEmail")}>
          <input
            type="email"
            placeholder="leader@example.com"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            onBlur={() => touch("leaderEmail")}
          />
        </Field>

        <PhoneInput
          label="Leader phone"
          value={leaderPhone}
          onChange={setLeaderPhone}
          onBlur={() => touch("leaderPhone")}
          error={err("leaderPhone")}
        />
      </div>

      {!isFixed && onChangeTeamSize && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="wizard-badge">Team of {teamSize}</span>
          <button
            type="button"
            onClick={onChangeTeamSize}
            className="wizard-btn ghost"
            style={{ padding: "6px 14px", fontSize: 10 }}
          >
            Change
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ---------------- Member sub-fields ---------------- */
function MemberCore({
  cfg,
  m,
  p,
  setMember,
  err,
  touch,
  institutionField,
}: {
  cfg: EventConfig;
  m: Member;
  p: string;
  setMember: (patch: Partial<Member>) => void;
  err: ErrFn;
  touch: TouchFn;
  institutionField: React.ReactNode;
}) {
  return (
    <>
      <div className="wizard-grid cols-2" style={{ marginBottom: 14 }}>
        <IdCardUploader
          value={m.idCard}
          onChange={(v) => setMember({ idCard: v })}
          onBlur={() => touch(p + "idCard")}
          error={err(p + "idCard")}
        />
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="Full name" error={err(p + "fullName")}>
            <input
              type="text"
              value={m.fullName}
              onChange={(e) => setMember({ fullName: e.target.value })}
              onBlur={() => touch(p + "fullName")}
            />
          </Field>
          <Field label="University ID number" error={err(p + "idNumber")}>
            <input
              type="text"
              placeholder="e.g. 20221001"
              value={m.idNumber}
              onChange={(e) => setMember({ idNumber: e.target.value })}
              onBlur={() => touch(p + "idNumber")}
            />
          </Field>
        </div>
      </div>

      <div className="wizard-grid cols-2">
        <Field label="Email" error={err(p + "email")}>
          <input
            type="email"
            value={m.email}
            onChange={(e) => setMember({ email: e.target.value })}
            onBlur={() => touch(p + "email")}
          />
        </Field>
        <PhoneInput
          label="Phone"
          value={m.phone}
          onChange={(v) => setMember({ phone: v })}
          onBlur={() => touch(p + "phone")}
          error={err(p + "phone")}
        />
        {institutionField}
        <Field label="Department" error={err(p + "department")}>
          <input
            type="text"
            placeholder="e.g. CSE"
            value={m.department}
            onChange={(e) => setMember({ department: e.target.value })}
            onBlur={() => touch(p + "department")}
          />
        </Field>
        <Field label="Year of study" error={err(p + "year")}>
          <select
            value={m.year}
            onChange={(e) => setMember({ year: e.target.value })}
            onBlur={() => touch(p + "year")}
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y} year
              </option>
            ))}
          </select>
        </Field>
        {cfg.memberExtras?.discord && (
          <Field label="Discord username" error={err(p + "discord")}>
            <input
              type="text"
              placeholder="e.g. neo#1337 or neo_hax"
              value={m.discord ?? ""}
              onChange={(e) => setMember({ discord: e.target.value })}
              onBlur={() => touch(p + "discord")}
            />
          </Field>
        )}
        {cfg.memberExtras?.role && (
          <Field
            label={cfg.key === "hackathon" ? "Primary role" : "Role on team"}
            error={err(p + "role")}
          >
            <select
              value={m.role ?? ""}
              onChange={(e) => setMember({ role: e.target.value })}
              onBlur={() => touch(p + "role")}
            >
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="T-shirt size" error={err(p + "tshirt")}>
          <select
            value={m.tshirt}
            onChange={(e) => setMember({ tshirt: e.target.value })}
            onBlur={() => touch(p + "tshirt")}
          >
            <option value="">Select size</option>
            {TSHIRT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </>
  );
}

/* ---------------- StepMembers ---------------- */
export function StepMembers({
  cfg,
  members,
  setMember,
  err,
  touch,
}: {
  cfg: EventConfig;
  members: Member[];
  setMember: (i: number, patch: Partial<Member>) => void;
  err: ErrFn;
  touch: TouchFn;
}) {
  return (
    <motion.div {...fadeMotion()}>
      <h3>{cfg.membersHeading(members.length)}</h3>
      <p className="wizard-card-sub">{cfg.membersDesc(members.length)}</p>

      {members.map((m, i) => {
        const p = `m${i}.`;
        return (
          <div key={i} className="wizard-member-card">
            <div className="wizard-member-head">
              <strong>Member {i + 1}</strong>
              {i === 0 && <span className="wizard-badge">Team leader</span>}
            </div>
            <MemberCore
              cfg={cfg}
              m={m}
              p={p}
              setMember={(patch) => setMember(i, patch)}
              err={err}
              touch={touch}
              institutionField={
                <Field
                  label="University / Institution"
                  error={err(p + "institution")}
                >
                  <input
                    type="text"
                    value={m.institution}
                    onChange={(e) => setMember(i, { institution: e.target.value })}
                    onBlur={() => touch(p + "institution")}
                  />
                </Field>
              }
            />
          </div>
        );
      })}
    </motion.div>
  );
}

/* ---------------- StepSolo ---------------- */
export function StepSolo({
  cfg,
  member,
  setMember,
  onChangeTeamSize,
  instSuggest,
  setInstSuggest,
  onInstitutionInput,
  pickInstitution,
  err,
  touch,
}: {
  cfg: EventConfig;
  member: Member;
  setMember: (patch: Partial<Member>) => void;
  onChangeTeamSize: () => void;
  instSuggest: string[];
  setInstSuggest: (v: string[]) => void;
  onInstitutionInput: (v: string) => void;
  pickInstitution: (v: string) => void;
  err: ErrFn;
  touch: TouchFn;
}) {
  const p = "m0.";
  return (
    <motion.div {...fadeMotion()}>
      <h3>Your details</h3>
      <p className="wizard-card-sub">{cfg.soloIntro}</p>

      <div
        style={{
          marginBottom: 18,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span className="wizard-badge">{cfg.soloBadge}</span>
        <button
          type="button"
          onClick={onChangeTeamSize}
          className="wizard-btn ghost"
          style={{ padding: "6px 14px", fontSize: 10 }}
        >
          Switch to team
        </button>
      </div>

      <MemberCore
        cfg={cfg}
        m={member}
        p={p}
        setMember={setMember}
        err={err}
        touch={touch}
        institutionField={
          <InstitutionField
            value={member.institution}
            onInput={onInstitutionInput}
            onPick={pickInstitution}
            suggestions={instSuggest}
            setSuggestions={setInstSuggest}
            errorKey={p + "institution"}
            err={err}
            touch={touch}
          />
        }
      />
    </motion.div>
  );
}

/* ---------------- StepCoach ---------------- */
import { PhotoUploader } from "./wizard-fields";

export function StepCoach({
  coach,
  setCoach,
  err,
  touch,
}: {
  coach: Coach;
  setCoach: (patch: Partial<Coach>) => void;
  err: ErrFn;
  touch: TouchFn;
}) {
  return (
    <motion.div {...fadeMotion()}>
      <h3>Team coach</h3>
      <p className="wizard-card-sub">
        Faculty or mentor accompanying the team on contest day.
      </p>

      <div className="wizard-member-card">
        <div className="wizard-grid cols-2" style={{ marginBottom: 14 }}>
          <PhotoUploader
            value={coach.photo}
            onChange={(v) => setCoach({ photo: v })}
            onBlur={() => touch("c.photo")}
            error={err("c.photo")}
          />
          <Field label="Full name" error={err("c.fullName")}>
            <input
              type="text"
              value={coach.fullName}
              onChange={(e) => setCoach({ fullName: e.target.value })}
              onBlur={() => touch("c.fullName")}
            />
          </Field>
        </div>
        <div className="wizard-grid cols-2">
          <Field label="Designation" error={err("c.designation")}>
            <input
              type="text"
              placeholder="e.g. Assistant Professor"
              value={coach.designation}
              onChange={(e) => setCoach({ designation: e.target.value })}
              onBlur={() => touch("c.designation")}
            />
          </Field>
          <Field label="University / Institution" error={err("c.institution")}>
            <input
              type="text"
              value={coach.institution}
              onChange={(e) => setCoach({ institution: e.target.value })}
              onBlur={() => touch("c.institution")}
            />
          </Field>
          <Field label="Department" error={err("c.department")}>
            <input
              type="text"
              placeholder="e.g. CSE"
              value={coach.department}
              onChange={(e) => setCoach({ department: e.target.value })}
              onBlur={() => touch("c.department")}
            />
          </Field>
          <Field label="T-shirt size" error={err("c.tshirt")}>
            <select
              value={coach.tshirt}
              onChange={(e) => setCoach({ tshirt: e.target.value })}
              onBlur={() => touch("c.tshirt")}
            >
              <option value="">Select size</option>
              {TSHIRT_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- StepProject ---------------- */
export function StepProject({
  project,
  setProject,
  err,
  touch,
}: {
  project: Project;
  setProject: (patch: Partial<Project>) => void;
  err: ErrFn;
  touch: TouchFn;
}) {
  return (
    <motion.div {...fadeMotion()}>
      <h3>Project idea</h3>
      <p className="wizard-card-sub">
        A rough direction is fine — you can iterate during the 24 hours. Judges use
        this to route mentors your way.
      </p>

      <div className="wizard-member-card">
        <div className="wizard-grid" style={{ marginBottom: 14 }}>
          <Field label="Working title" error={err("p.title")}>
            <input
              type="text"
              placeholder="e.g. GreenRoute — city routing that prices carbon"
              value={project.title}
              onChange={(e) => setProject({ title: e.target.value })}
              onBlur={() => touch("p.title")}
            />
          </Field>
        </div>
        <div className="wizard-grid" style={{ marginBottom: 14 }}>
          <Field label="One-paragraph pitch" error={err("p.pitch")}>
            <textarea
              rows={4}
              placeholder="What are you building, for whom, and why is it interesting?"
              value={project.pitch}
              onChange={(e) => setProject({ pitch: e.target.value })}
              onBlur={() => touch("p.pitch")}
            />
          </Field>
        </div>
        <div className="wizard-grid" style={{ marginBottom: 14 }}>
          <Field label="Problem statement" error={err("p.problem")}>
            <textarea
              rows={3}
              placeholder="What specific pain point are you tackling?"
              value={project.problem}
              onChange={(e) => setProject({ problem: e.target.value })}
              onBlur={() => touch("p.problem")}
            />
          </Field>
        </div>
        <div className="wizard-grid">
          <Field label="Tech stack" error={err("p.stack")}>
            <input
              type="text"
              placeholder="e.g. React, FastAPI, Postgres, OpenAI"
              value={project.stack}
              onChange={(e) => setProject({ stack: e.target.value })}
              onBlur={() => touch("p.stack")}
            />
          </Field>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- StepReview ---------------- */
export function StepReview({
  cfg,
  isSolo,
  teamName,
  institution,
  leaderName,
  leaderEmail,
  leaderPhone,
  members,
  coach,
  project,
  agreeRules,
  setAgreeRules,
  agreeInfo,
  setAgreeInfo,
  agreeMedia,
  setAgreeMedia,
}: {
  cfg: EventConfig;
  isSolo: boolean;
  teamName: string;
  institution: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: Member[];
  coach?: Coach;
  project?: Project;
  agreeRules: boolean;
  setAgreeRules: (v: boolean) => void;
  agreeInfo: boolean;
  setAgreeInfo: (v: boolean) => void;
  agreeMedia: boolean;
  setAgreeMedia: (v: boolean) => void;
}) {
  return (
    <motion.div {...fadeMotion()}>
      <h3>Review &amp; confirm</h3>
      <p className="wizard-card-sub">
        Double-check everything before you head to payment.
      </p>

      {!isSolo && (
        <div className="wizard-review-block">
          <h5>// team</h5>
          <dl className="wizard-review-grid">
            <dt>Team name</dt><dd>{teamName || "—"}</dd>
            <dt>Institution</dt><dd>{institution || "—"}</dd>
            <dt>Leader name</dt><dd>{leaderName || "—"}</dd>
            <dt>Leader email</dt><dd>{leaderEmail || "—"}</dd>
            <dt>Leader phone</dt><dd>{leaderPhone ? `+880 ${leaderPhone}` : "—"}</dd>
          </dl>
        </div>
      )}

      {members.map((m, i) => (
        <div key={i} className="wizard-review-block">
          <h5>
            // member {i + 1}
            {i === 0 ? " · leader" : ""}
          </h5>
          <div className="wizard-review-photo-row">
            <div
              className="wizard-review-photo"
              style={{
                width: 140,
                height: 88,
                borderRadius: 8,
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...(m.idCard ? { backgroundImage: `url(${m.idCard})` } : {}),
              }}
              aria-label={`${m.fullName || "member"} university id card`}
            >
              {!m.idCard && <IconCamera size={20} />}
            </div>
            <dl className="wizard-review-grid" style={{ flex: 1 }}>
              <dt>Full name</dt><dd>{m.fullName || "—"}</dd>
              <dt>ID number</dt><dd>{m.idNumber || "—"}</dd>
              <dt>Email</dt><dd>{m.email || "—"}</dd>
              <dt>Phone</dt><dd>{m.phone ? `+880 ${m.phone}` : "—"}</dd>
              <dt>Institution</dt><dd>{m.institution || "—"}</dd>
              <dt>Department</dt><dd>{m.department || "—"}</dd>
              <dt>Year</dt><dd>{m.year || "—"}</dd>
              {cfg.memberExtras?.discord && (
                <><dt>Discord</dt><dd>{m.discord || "—"}</dd></>
              )}
              {cfg.memberExtras?.role && (
                <><dt>Role</dt><dd>{m.role || "—"}</dd></>
              )}
              <dt>T-shirt</dt><dd>{m.tshirt || "—"}</dd>
            </dl>
          </div>
        </div>
      ))}

      {coach && (
        <div className="wizard-review-block">
          <h5>// coach</h5>
          <div className="wizard-review-photo-row">
            <div
              className="wizard-review-photo"
              style={coach.photo ? { backgroundImage: `url(${coach.photo})` } : undefined}
              aria-label="coach photo"
            >
              {!coach.photo && <IconCamera size={20} />}
            </div>
            <dl className="wizard-review-grid" style={{ flex: 1 }}>
              <dt>Full name</dt><dd>{coach.fullName || "—"}</dd>
              <dt>Designation</dt><dd>{coach.designation || "—"}</dd>
              <dt>Institution</dt><dd>{coach.institution || "—"}</dd>
              <dt>Department</dt><dd>{coach.department || "—"}</dd>
              <dt>T-shirt</dt><dd>{coach.tshirt || "—"}</dd>
            </dl>
          </div>
        </div>
      )}

      {project && (
        <div className="wizard-review-block">
          <h5>// project</h5>
          <dl className="wizard-review-grid">
            <dt>Title</dt><dd>{project.title || "—"}</dd>
            <dt>Pitch</dt><dd>{project.pitch || "—"}</dd>
            <dt>Problem</dt><dd>{project.problem || "—"}</dd>
            <dt>Stack</dt><dd>{project.stack || "—"}</dd>
          </dl>
        </div>
      )}

      <div className="wizard-agreements">
        <label className="wizard-agree">
          <input
            type="checkbox"
            checked={agreeRules}
            onChange={(e) => setAgreeRules(e.target.checked)}
          />
          <span dangerouslySetInnerHTML={{ __html: cfg.rulesAgree }} />
        </label>
        <label className="wizard-agree">
          <input
            type="checkbox"
            checked={agreeInfo}
            onChange={(e) => setAgreeInfo(e.target.checked)}
          />
          <span>
            All information provided is accurate. I understand false details may lead to
            <strong> disqualification</strong> without refund.
          </span>
        </label>
        <label className="wizard-agree">
          <input
            type="checkbox"
            checked={agreeMedia}
            onChange={(e) => setAgreeMedia(e.target.checked)}
          />
          <span>
            I consent to photos/videos captured during the event being used for
            <strong> promotional purposes</strong> by BUP CSE Society.
          </span>
        </label>
      </div>
    </motion.div>
  );
}

/* ---------------- StepPayment ---------------- */
export function StepPayment({
  payMethod,
  setPayMethod,
  submitting,
  onPay,
  fee,
}: {
  payMethod: "bkash" | "nagad" | "card";
  setPayMethod: (v: "bkash" | "nagad" | "card") => void;
  submitting: boolean;
  onPay: () => void;
  fee: number;
}) {
  return (
    <motion.div {...fadeMotion()}>
      <h3>Payment</h3>
      <p className="wizard-card-sub">
        Choose a payment method. Registration is confirmed once payment succeeds.
      </p>

      <div className="wizard-pay-methods" role="radiogroup" aria-label="Payment method">
        {(
          [
            { id: "bkash", name: "bKash", hint: "Mobile wallet" },
            { id: "nagad", name: "Nagad", hint: "Mobile wallet" },
            { id: "card", name: "Card", hint: "Visa · Mastercard" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={payMethod === m.id}
            className={`wizard-pay-method ${payMethod === m.id ? "active" : ""}`}
            onClick={() => setPayMethod(m.id)}
          >
            <strong>{m.name}</strong>
            <span>{m.hint}</span>
          </button>
        ))}
      </div>

      <div className="wizard-review-block" style={{ marginTop: 20 }}>
        <h5>// summary</h5>
        <dl className="wizard-review-grid">
          <dt>Registration fee</dt><dd>৳{fee}</dd>
          <dt>Method</dt>
          <dd style={{ textTransform: "capitalize" }}>{payMethod}</dd>
          <dt>Total due</dt>
          <dd style={{ color: "var(--color-cn-gold)", fontWeight: 700 }}>৳{fee}</dd>
        </dl>
      </div>

      <p className="wizard-card-sub" style={{ marginTop: 16, marginBottom: 0 }}>
        No card data ever touches our servers — payment happens on the gateway.
      </p>
      {submitting && <p className="wizard-card-sub">Processing your payment…</p>}
      <div style={{ display: "none" }}>{onPay.toString().length}</div>
    </motion.div>
  );
}
