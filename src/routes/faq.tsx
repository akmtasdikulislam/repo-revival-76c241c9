import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteLayout } from "@/components/carnival/SiteLayout";

const FAQS = [
  {
    q: "Who can participate?",
    a: "Any current university student in Bangladesh can join IUPC and CTF. The Hackathon is open to student teams of up to 4 members, mixed departments welcome.",
  },
  {
    q: "Can I register for more than one track?",
    a: "Yes — IUPC, CTF Championship, and Hackathon are independent registrations, so you can sign up for more than one as long as your schedule allows.",
  },
  {
    q: "When will the eligible team list be published?",
    a: "Each event page has an 'Eligible teams' section. Organizers publish it there once registration closes and slots are finalized.",
  },
  {
    q: "How do I pay the registration fee?",
    a: "Once your team is marked eligible/selected, a payment box will appear on the status page letting you pay via bKash, Nagad, or Rocket and submit your transaction ID.",
  },
  {
    q: "I registered but made a mistake in my team details. What now?",
    a: "Reach out using the form below with your team name and event, and organizers will help correct it.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — BUP CSE Tech Carnival 2.0" },
      { name: "description", content: "Frequently asked questions about BUP CSE Tech Carnival 2.0." },
      { property: "og:title", content: "FAQ — BUP CSE Tech Carnival 2.0" },
      { property: "og:description", content: "Answers about registration, eligibility, and payment." },
    ],
  }),
  component: FAQ,
});

interface AskForm {
  name: string;
  email: string;
  question: string;
}

function FAQ() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm<AskForm>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => (f.q + " " + f.a).toLowerCase().includes(q));
  }, [query]);

  const onSubmit = handleSubmit((data) => {
    try {
      const list = JSON.parse(localStorage.getItem("bcc_faq_questions") || "[]");
      list.push({ ...data, createdAt: Date.now() });
      localStorage.setItem("bcc_faq_questions", JSON.stringify(list));
    } catch {
      /* ignore */
    }
    reset();
    setSubmitted(true);
  });

  return (
    <SiteLayout>
      <section className="section" style={{ paddingTop: 150 }}>
        <div className="sec-hdr">
          <span className="sec-num">// faq --list</span>
          <h2 className="sec-title">Frequently asked</h2>
        </div>
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search questions… e.g. payment, eligible, team"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="accordion">
          {filtered.map((f, i) => (
            <div key={f.q} className={`acc-item${openIdx === i ? " open" : ""}`}>
              <button
                type="button"
                className="acc-head"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {f.q}
                <span className="acc-icon">+</span>
              </button>
              <div className="acc-body">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="faq-empty">
              No questions match your search — try a different keyword, or ask below.
            </p>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="sec-hdr">
          <span className="sec-num">// ask --question</span>
          <h2 className="sec-title">
            Still stuck? <em>Ask us</em>
          </h2>
          <p className="sec-sub">Your question goes straight to the organizing team.</p>
        </div>
        <div className="reg-card">
          {submitted && (
            <div className="reg-success" style={{ display: "block" }}>
              ✓ Thanks! Your question has been submitted.
            </div>
          )}
          <form onSubmit={onSubmit}>
            <label>
              Your name
              <input type="text" {...register("name", { required: true })} />
            </label>
            <label>
              Email
              <input type="email" {...register("email", { required: true })} />
            </label>
            <label>
              Your question
              <textarea rows={4} {...register("question", { required: true })} />
            </label>
            <button type="submit" className="btn-primary">
              ./submit --question
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
