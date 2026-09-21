"use client";

import { useMemo, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type ContactFormCopy = {
  subjects: string[];
  fields: {
    name: { label: string; required: boolean; placeholder: string };
    company: { label: string; required: boolean; placeholder: string };
    email: { label: string; required: boolean; placeholder: string };
    subject: { label: string; required: boolean; placeholder: string };
    message: { label: string; required: boolean; placeholder: string };
  };
  submitLabel: string;
  successMessage: string;
};

const inputClass =
  "mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gtek-amber/70 focus:ring-2 focus:ring-gtek-amber/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

export default function ContactForm({ copy }: { copy: ContactFormCopy }) {
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

      setState({ status: "success", message: data.message ?? copy.successMessage });
      form.reset();
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {copy.fields.name.label}
          <input
            name="name"
            required={copy.fields.name.required}
            className={inputClass}
            placeholder={copy.fields.name.placeholder}
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {copy.fields.company.label}
          <input
            name="company"
            required={copy.fields.company.required}
            className={inputClass}
            placeholder={copy.fields.company.placeholder}
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {copy.fields.email.label}
        <input
          name="email"
          type="email"
          required={copy.fields.email.required}
          className={inputClass}
          placeholder={copy.fields.email.placeholder}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {copy.fields.subject.label}
        <select
          name="subject"
          required={copy.fields.subject.required}
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            {copy.fields.subject.placeholder}
          </option>
          {copy.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {copy.fields.message.label}
        <textarea
          name="message"
          required={copy.fields.message.required}
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder={copy.fields.message.placeholder}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-full bg-gtek-amber px-6 py-3 text-base font-bold text-gtek-navy transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.status === "submitting" ? "Sending..." : copy.submitLabel}
        </button>
        {state.status === "success" ? (
          <p className="text-sm font-semibold text-emerald-700">{state.message}</p>
        ) : null}
        {state.status === "error" ? <p className="text-sm font-semibold text-red-700">{state.message}</p> : null}
      </div>
    </form>
  );
}
