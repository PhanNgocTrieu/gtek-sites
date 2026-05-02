"use client";

import { useMemo, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const subjects = ["General Inquiry", "Project Inquiry", "Career", "Other"] as const;

export default function ContactForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const canSubmit = useMemo(() => state.status !== "submitting", [state.status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        setState({ status: "error", message: data.message ?? "Unable to send message. Please try again." });
        return;
      }

      setState({ status: "success", message: data.message ?? "Message sent. We’ll get back to you shortly." });
      form.reset();
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot field (anti-spam). Humans should not fill this. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-slate-700">
          Name
          <input
            name="name"
            required
            className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gtek-amber"
            placeholder="Your name"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Company
          <input
            name="company"
            className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gtek-amber"
            placeholder="Company (optional)"
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-700 block">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gtek-amber"
          placeholder="you@company.com"
        />
      </label>

      <label className="text-sm font-semibold text-slate-700 block">
        Subject
        <select
          name="subject"
          required
          defaultValue=""
          className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gtek-amber"
        >
          <option value="" disabled>
            Select a subject…
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold text-slate-700 block">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 block w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gtek-amber"
          placeholder="Tell us about your project, timeline, and any site constraints."
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-md bg-gtek-amber px-6 py-3 text-base font-bold text-gtek-navy transition-colors hover:bg-yellow-400 disabled:opacity-60"
        >
          {state.status === "submitting" ? "Sending..." : "Send Message"}
        </button>
        {state.status === "success" ? (
          <p className="text-sm font-semibold text-emerald-700">{state.message}</p>
        ) : null}
        {state.status === "error" ? <p className="text-sm font-semibold text-red-700">{state.message}</p> : null}
      </div>
    </form>
  );
}

