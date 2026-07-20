import { useState } from "react";
import { motion } from "framer-motion";
import { IconSend, IconCheck } from "@tabler/icons-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  university: z.string().trim().min(2, "University is required").max(160),
});

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", university: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Persist locally for now; wire to backend later.
    try {
      const key = "carnival:contact-messages";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
      prev.push({ ...parsed.data, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 500);
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="sec-hdr">
        <span className="sec-num">// contact --open</span>
        <h2 className="sec-title">
          Get in <em>touch</em>
        </h2>
        <p className="sec-sub">
          Questions, partnership ideas, or press enquiries — drop us a line and the CSE Carnival team
          will reply within 48 hours.
        </p>
      </div>

      <motion.form
        className="contact-form"
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {sent ? (
          <div className="contact-success">
            <span className="contact-success-icon">
              <IconCheck size={22} />
            </span>
            <div>
              <strong>Message received.</strong>
              <p>Thanks {form.name.split(" ")[0]} — we'll be in touch at {form.email}.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="contact-row">
              <label className="contact-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  maxLength={80}
                />
                {errors.name && <em className="contact-err">{errors.name}</em>}
              </label>
              <label className="contact-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@university.edu"
                  autoComplete="email"
                  maxLength={160}
                />
                {errors.email && <em className="contact-err">{errors.email}</em>}
              </label>
            </div>
            <label className="contact-field">
              <span>University / Institution</span>
              <input
                type="text"
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                placeholder="Bangladesh University of Professionals"
                maxLength={160}
              />
              {errors.university && <em className="contact-err">{errors.university}</em>}
            </label>
            <div className="contact-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                <IconSend size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} />
                {submitting ? "Sending…" : "Send message"}
              </button>
              <span className="contact-note">We reply within 48 hours.</span>
            </div>
          </>
        )}
      </motion.form>
    </section>
  );
}
