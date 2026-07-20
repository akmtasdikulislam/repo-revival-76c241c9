import { useForm } from "react-hook-form";
import { useState } from "react";
import { BD_INSTITUTIONS } from "@/data/institutions";

type Member = { name: string; email: string; phone: string };

export interface RegistrationValues {
  teamName: string;
  institution: string;
  coachName?: string;
  coachEmail?: string;
  coachPhone?: string;
  members: Member[];
}

interface Props {
  event: "iupc" | "ctf" | "hackathon";
  minMembers: number;
  maxMembers: number;
  requireCoach?: boolean;
}

export function RegistrationForm({ event, minMembers, maxMembers, requireCoach }: Props) {
  const { register, handleSubmit, formState, reset, watch, setValue } = useForm<RegistrationValues>({
    defaultValues: {
      teamName: "",
      institution: "",
      members: Array.from({ length: minMembers }, () => ({ name: "", email: "", phone: "" })),
    },
  });
  const [teamId, setTeamId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const members = watch("members");

  function onInstitutionInput(v: string) {
    setValue("institution", v);
    const q = v.trim().toLowerCase();
    if (q.length < 2) return setSuggestions([]);
    setSuggestions(
      BD_INSTITUTIONS.filter((i) => i.toLowerCase().includes(q)).slice(0, 8),
    );
  }

  function addMember() {
    if (members.length >= maxMembers) return;
    setValue("members", [...members, { name: "", email: "", phone: "" }]);
  }
  function removeMember(i: number) {
    if (members.length <= minMembers) return;
    setValue(
      "members",
      members.filter((_, idx) => idx !== i),
    );
  }

  const onSubmit = handleSubmit((data) => {
    const id = "TC-" + Math.random().toString(36).slice(2, 9).toUpperCase();
    setTeamId(id);
    // Persist locally, matching original demo behaviour
    try {
      const key = "bcc_registrations";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ id, event, ...data, createdAt: Date.now() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* ignore */
    }
    reset({
      teamName: "",
      institution: "",
      members: Array.from({ length: minMembers }, () => ({ name: "", email: "", phone: "" })),
    });
  });

  return (
    <div className="reg-card reveal in">
      {teamId && (
        <div className="reg-success" style={{ display: "block" }}>
          <span>
            ✓ Registered! Your team ID is <strong>{teamId}</strong>. Save this for reference.
          </span>
          <button
            type="button"
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(teamId)}
          >
            copy ID
          </button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label>
          Team name
          <input
            type="text"
            placeholder="e.g. Binary Brigade"
            {...register("teamName", { required: true })}
          />
        </label>

        <label>
          Institution / University
          <span className="institution-autocomplete">
            <input
              type="text"
              placeholder="Start typing your university or college…"
              value={watch("institution")}
              onChange={(e) => onInstitutionInput(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              autoComplete="off"
              required
            />
            {suggestions.length > 0 && (
              <span className="institution-suggestions" role="listbox">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="option"
                    className="institution-option"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue("institution", s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </span>
            )}
          </span>
        </label>

        {requireCoach && (
          <div className="coach-block">
            <span className="members-label">Coach details (required)</span>
            <div className="coach-grid">
              <label>
                Coach name
                <input type="text" {...register("coachName", { required: true })} />
              </label>
              <label>
                Coach email
                <input type="email" {...register("coachEmail", { required: true })} />
              </label>
              <label>
                Coach phone
                <span className="phone-input">
                  <span className="phone-prefix">+880</span>
                  <input
                    type="tel"
                    placeholder="1XXXXXXXXX"
                    inputMode="numeric"
                    {...register("coachPhone", { required: true })}
                  />
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="members-block">
          <span className="members-label">
            Team members ({minMembers === maxMembers ? minMembers : `${minMembers}–${maxMembers}`}{" "}
            required)
          </span>
          <div id="membersWrap">
            {members.map((_, i) => (
              <div key={i} className="member-row">
                <div className="member-head">
                  <strong>Member {i + 1}</strong>
                  {members.length > minMembers && (
                    <button type="button" className="btn-ghost small" onClick={() => removeMember(i)}>
                      remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register(`members.${i}.name`, { required: true })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  {...register(`members.${i}.email`, { required: true })}
                />
                <span className="phone-input">
                  <span className="phone-prefix">+880</span>
                  <input
                    type="tel"
                    placeholder="1XXXXXXXXX"
                    inputMode="numeric"
                    {...register(`members.${i}.phone`, { required: true })}
                  />
                </span>
              </div>
            ))}
          </div>
          {members.length < maxMembers && (
            <button type="button" className="btn-ghost small" onClick={addMember}>
              + add member
            </button>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={formState.isSubmitting}>
          ./submit --registration
        </button>
      </form>
    </div>
  );
}
