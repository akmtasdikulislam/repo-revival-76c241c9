import { useState, type ChangeEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { IconCamera, IconCheck, IconReceipt2 } from "@tabler/icons-react";
import { BD_INSTITUTIONS } from "@/data/institutions";
import { STEP_META, type StepId, type ErrFn, type TouchFn } from "./types";

export const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
export const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate"];
export const ROLE_OPTIONS = [
  "Team Lead",
  "Frontend",
  "Backend",
  "Full-stack",
  "Mobile",
  "AI / ML",
  "Designer",
  "Product / PM",
  "Other",
];

export const emailRe = /^\S+@\S+\.\S+$/;
export const digits = (v: string) => v.replace(/\D/g, "");

export function fadeMotion() {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  };
}

export function filterInstitutions(q: string): string[] {
  const s = q.trim().toLowerCase();
  if (s.length < 2) return [];
  return BD_INSTITUTIONS.filter((i) => i.toLowerCase().includes(s)).slice(0, 6);
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={`wizard-field ${error ? "err" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <span className="wizard-err-msg">{error}</span>}
    </label>
  );
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  label: string;
}) {
  return (
    <Field label={label} error={error}>
      <span className="wizard-phone">
        <span className="wizard-phone-prefix">+880</span>
        <input
          type="tel"
          placeholder="1XXXXXXXXX"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      </span>
    </Field>
  );
}

export function PhotoUploader({
  value,
  onChange,
  error,
  onBlur,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }
  return (
    <div className={`wizard-field ${error ? "err" : ""}`}>
      <span>Photo</span>
      <div className="wizard-photo">
        <div
          className="wizard-photo-thumb"
          style={value ? { backgroundImage: `url(${value})` } : undefined}
        >
          {!value && <IconCamera size={22} />}
        </div>
        <div className="wizard-photo-actions">
          <label className="wizard-photo-btn">
            {value ? "Change" : "Upload"}
            <input type="file" accept="image/*" onChange={handleFile} onBlur={onBlur} />
          </label>
          <span className="wizard-photo-hint">
            JPG / PNG · square · max 2 MB · min 400×400 px
          </span>
        </div>
      </div>
      {error && <span className="wizard-err-msg">{error}</span>}
    </div>
  );
}

export function InstitutionField({
  value,
  onInput,
  onPick,
  suggestions,
  setSuggestions,
  errorKey,
  err,
  touch,
}: {
  value: string;
  onInput: (v: string) => void;
  onPick: (v: string) => void;
  suggestions: string[];
  setSuggestions: (v: string[]) => void;
  errorKey: string;
  err: ErrFn;
  touch: TouchFn;
}) {
  const errMsg = err(errorKey);
  return (
    <div
      className={`wizard-field ${errMsg ? "err" : ""}`}
      style={{ position: "relative" }}
    >
      <span>University / Institution</span>
      <input
        type="text"
        placeholder="Start typing…"
        autoComplete="off"
        value={value}
        onChange={(e) => onInput(e.target.value)}
        onBlur={() => {
          touch(errorKey);
          setTimeout(() => setSuggestions([]), 150);
        }}
      />
      {suggestions.length > 0 && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "var(--color-cn-surface-2)",
            border: "1px solid var(--color-cn-strong)",
            borderRadius: 10,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(s);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                background: "transparent",
                border: 0,
                color: "var(--color-cn-ink)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {errMsg && <span className="wizard-err-msg">{errMsg}</span>}
    </div>
  );
}

export function StepBar({
  flow,
  stepIndex,
}: {
  flow: StepId[];
  stepIndex: number;
}) {
  const total = flow.length;
  const progress = total > 1 ? (stepIndex / (total - 1)) * 100 : 0;
  return (
    <div className="wizard-stepbar" role="list" aria-label="Registration steps">
      <div className="wizard-stepbar-track" aria-hidden>
        <div className="wizard-stepbar-fill" style={{ width: `${progress}%` }} />
      </div>
      {flow.map((id, idx) => {
        const meta = STEP_META[id];
        const state = stepIndex > idx ? "done" : stepIndex === idx ? "current" : "";
        return (
          <div
            key={id}
            className={`wizard-step ${state}`}
            role="listitem"
            aria-current={stepIndex === idx ? "step" : undefined}
          >
            <span className="wizard-step-node">
              {stepIndex > idx ? (
                <IconCheck size={14} strokeWidth={3} />
              ) : (
                <meta.Icon size={14} />
              )}
            </span>
            <span className="wizard-step-label">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function FeeBanner({
  feePerPerson,
  teamSize,
  total,
  isSolo,
  soloLabel,
}: {
  feePerPerson: number;
  teamSize: number;
  total: number;
  isSolo: boolean;
  soloLabel: string;
}) {
  return (
    <div className="wizard-fee-banner" role="note">
      <span className="wizard-fee-banner-icon" aria-hidden>
        <IconReceipt2 size={18} />
      </span>
      <div className="wizard-fee-banner-body">
        <span className="wizard-fee-banner-label">Registration fee</span>
        <span className="wizard-fee-banner-value">
          ৳{feePerPerson} <em>/person</em> ·{" "}
          {isSolo ? soloLabel : `Team of ${teamSize}`} ·{" "}
          <strong>৳{total} total</strong>
        </span>
      </div>
      <span className="wizard-fee-banner-hint">Paid at checkout</span>
    </div>
  );
}

export function SuccessPanel({
  code,
  teamName,
  subject,
  hint,
}: {
  code: string;
  teamName: string;
  subject: string;
  hint: string;
}) {
  return (
    <motion.div {...fadeMotion()} className="wizard-success">
      <div className="wizard-tick">✓</div>
      <h3>Team registered</h3>
      <p>
        Payment received.{" "}
        <strong style={{ color: "var(--color-cn-ink)" }}>{teamName}</strong> is officially
        in the {subject}.
      </p>
      <div className="wizard-team-code">{code}</div>
      <p>Save this team code — you'll need it for {hint}.</p>
    </motion.div>
  );
}

const SIZE_SPECS: Record<string, { chest: string; length: string }> = {
  S: { chest: '38" / 96 cm', length: '27" / 68 cm' },
  M: { chest: '40" / 102 cm', length: '28" / 71 cm' },
  L: { chest: '42" / 107 cm', length: '29" / 74 cm' },
  XL: { chest: '44" / 112 cm', length: '30" / 76 cm' },
  XXL: { chest: '46" / 117 cm', length: '31" / 79 cm' },
};

export function SizeChart({
  size,
  onSize,
}: {
  size: string;
  onSize: (s: string) => void;
}) {
  const spec = SIZE_SPECS[size] ?? SIZE_SPECS.M;
  return (
    <div className="wizard-size-chart">
      <div className="wizard-size-head">
        <span>// size chart</span>
        <span className="wizard-size-tag">UNISEX · FLAT</span>
      </div>
      <div className="wizard-size-preview" aria-hidden>
        <svg viewBox="0 0 220 180" width="100%" height="150" fill="none">
          <path
            d="M70 22 L52 34 L22 52 L34 76 L58 64 L58 158 L162 158 L162 64 L186 76 L198 52 L168 34 L150 22 C144 36 132 44 110 44 C88 44 76 36 70 22 Z"
            stroke="var(--color-cn-gold)"
            strokeWidth="1.6"
            fill="rgba(242,183,5,0.05)"
            strokeLinejoin="round"
          />
          <line
            x1="58"
            y1="88"
            x2="162"
            y2="88"
            stroke="var(--color-cn-mint)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          <text
            x="110"
            y="83"
            textAnchor="middle"
            fill="var(--color-cn-mint)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="700"
          >
            chest {spec.chest}
          </text>
          <line
            x1="172"
            y1="64"
            x2="172"
            y2="158"
            stroke="var(--color-cn-mint)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          <text
            x="178"
            y="115"
            fill="var(--color-cn-mint)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="700"
            transform="rotate(90 178 115)"
            textAnchor="middle"
          >
            len {spec.length}
          </text>
          <text
            x="110"
            y="115"
            textAnchor="middle"
            fill="var(--color-cn-gold)"
            fontSize="28"
            fontFamily="var(--font-mono)"
            fontWeight="800"
            opacity="0.85"
          >
            {size}
          </text>
        </svg>
      </div>
      <div
        className="wizard-size-pills"
        role="radiogroup"
        aria-label="Preview t-shirt size"
      >
        {TSHIRT_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={size === s}
            className={`wizard-size-pill ${size === s ? "active" : ""}`}
            onClick={() => onSize(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="wizard-size-specs">
        <div>
          <span>Chest</span>
          <strong>{spec.chest}</strong>
        </div>
        <div>
          <span>Length</span>
          <strong>{spec.length}</strong>
        </div>
      </div>
      <p className="wizard-size-hint">
        Tap a size to preview. Between two? Pick the larger for a relaxed fit. 180
        GSM combed cotton.
      </p>
    </div>
  );
}

export type SummaryAsideRow = { label: string; value: string };

export function SummaryAside({ rows, fee }: { rows: SummaryAsideRow[]; fee: number }) {
  const [previewSize, setPreviewSize] = useState<string>("M");
  return (
    <div className="wizard-aside-col">
      <aside className="wizard-aside">
        <h4>// order summary</h4>
        {rows.map((r) => (
          <div key={r.label} className="wizard-aside-row">
            <span>{r.label}</span>
            <span style={{ textAlign: "right", maxWidth: 180 }}>{r.value}</span>
          </div>
        ))}
        <div className="wizard-aside-total">
          <span>Total</span>
          <strong>৳{fee}</strong>
        </div>
      </aside>

      <aside className="wizard-aside wizard-aside-size">
        <SizeChart size={previewSize} onSize={setPreviewSize} />
      </aside>
    </div>
  );
}

export function TeamSizeChooser({
  heading,
  sub,
  options,
  feePerPerson,
  onPick,
}: {
  heading: string;
  sub: string;
  options: { n: number; title: string; desc: string; tag: string }[];
  feePerPerson: number;
  onPick: (n: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="wizard-card"
      style={{ maxWidth: 780, margin: "0 auto" }}
    >
      <h3>{heading}</h3>
      <p className="wizard-card-sub">{sub}</p>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginTop: 8,
        }}
      >
        {options.map((o) => (
          <button
            key={o.n}
            type="button"
            onClick={() => onPick(o.n)}
            className="wizard-pay-method"
            style={{ alignItems: "flex-start" }}
          >
            <span className="wizard-badge" style={{ marginBottom: 8 }}>
              {o.tag}
            </span>
            <strong style={{ fontSize: 16 }}>{o.title}</strong>
            <span style={{ marginTop: 4 }}>{o.desc}</span>
            <span
              style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--color-cn-gold)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ৳{feePerPerson * o.n} total
            </span>
          </button>
        ))}
      </div>
      <p
        className="wizard-card-sub"
        style={{ marginTop: 18, marginBottom: 0, fontSize: 12 }}
      >
        Registration fee is ৳{feePerPerson} per person, paid at checkout.
      </p>
    </motion.div>
  );
}
