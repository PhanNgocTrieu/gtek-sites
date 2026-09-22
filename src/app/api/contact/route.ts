import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSanityClient } from "@/sanity/client";
import { coalesceText, siteConfig } from "@/content/siteConfig";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clamp(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}

function usesResendTestSender(from: string) {
  return /@resend\.dev/i.test(from);
}

/** Resend accepts `Name <user@domain.com>` or bare `user@domain.com`. */
function normalizeResendFrom(from: string) {
  const trimmed = from.trim();
  if (!trimmed) return trimmed;
  if (/<[^>]+@[^>]+>/.test(trimmed)) return trimmed;
  const emailOnly = trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (emailOnly) return `GTek Website <${emailOnly[0]}>`;
  return trimmed;
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function resendErrorDetail(error: unknown): string {
  if (!error || typeof error !== "object") return String(error ?? "");
  const e = error as { message?: unknown };
  return typeof e.message === "string" ? e.message : JSON.stringify(error);
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  const name = form.get("name");
  const company = form.get("company");
  const email = form.get("email");
  const message = form.get("message");
  const subject = form.get("subject");
  const website = form.get("website");

  console.log(
    `name ${String(name)}, company: ${String(company)}, email: ${String(email)}, message: ${String(message)}, subject: ${String(subject)}, website: ${String(website)}`,
  );

  // Honeypot: if filled, treat as spam and return success (avoid feedback loops).
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ message: "Thanks — your message was sent." }, { status: 200 });
  }

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message) || !isNonEmptyString(subject)) {
    return NextResponse.json({ message: "Please fill in name, email, subject, and message." }, { status: 400 });
  }

  const safeName = clamp(name.trim(), 120);
  const safeCompany = typeof company === "string" ? clamp(company.trim(), 200) : "";
  const safeEmail = clamp(email.trim(), 200);
  const safeMessage = clamp(message.trim(), 5000);
  const safeSubject = clamp(subject.trim(), 80);

  const apiKey = process.env.RESEND_API_KEY;
  const envToEmail = process.env.CONTACT_TO_EMAIL?.trim();
  let toEmail = envToEmail || siteConfig.settings.contact.contactEmail;
  const fromEmail = normalizeResendFrom(
    process.env.CONTACT_FROM_EMAIL?.trim() || "GTek Website <noreply@gtekeng.com>",
  );
  // const ackFromEmail = process.env.CONTACT_ACK_FROM_EMAIL?.trim() || fromEmail;
  // const sendAck = (process.env.CONTACT_SEND_ACK ?? "").trim().toLowerCase() === "true";
  const testSender = usesResendTestSender(fromEmail);

  // CMS contactEmail (@gtekeng.com) only works after gtekeng.com is verified on Resend.
  if (!testSender) {
    try {
      const client = getSanityClient({ useCdn: true });
      if (client) {
        const siteSettings = await client.fetch(`*[_type=="siteSettings" && _id=="siteSettings"][0]{ contactEmail }`);
        if (siteSettings?.contactEmail) {
          toEmail = coalesceText(siteSettings.contactEmail, toEmail);
        }
      }
    } catch {
      // ignore and fallback to env/default
    }
  }

  toEmail = toEmail.trim();

  console.log("Sending contact inquiry replyTo:", safeEmail, "to:", toEmail, "from:", fromEmail, "subject:", safeSubject);

  if (!isLikelyEmail(toEmail)) {
    console.error("Invalid CONTACT_TO_EMAIL / Sanity contactEmail:", toEmail);
    return NextResponse.json(
      {
        message:
          "Email service is misconfigured (invalid recipient). Please contact us at wayne.wong@gtekeng.com directly.",
      },
      { status: 500 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "Email service is not configured yet. Please email wayne.wong@gtekeng.com directly.",
      },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const inquiry = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: safeEmail,
      subject: `[${safeSubject}] New website inquiry from ${safeName}`,
      text: [
        `Name: ${safeName}`,
        safeCompany ? `Company: ${safeCompany}` : null,
        `Email: ${safeEmail}`,
        `Subject: ${safeSubject}`,
        "",
        safeMessage,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
          <h2>New website inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          ${safeCompany ? `<p><strong>Company:</strong> ${escapeHtml(safeCompany)}</p>` : ""}
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
          <hr />
          <pre style="white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${escapeHtml(
        safeMessage,
      )}</pre>
        </div>
      `,
    });

    if (inquiry.error) {
      const detail = resendErrorDetail(inquiry.error);
      console.error("Resend inquiry send failed:", inquiry.error);
      return NextResponse.json({ message: resendUserMessage(detail) }, { status: 502 });
    }

    // if (sendAck && (!testSender || safeEmail.toLowerCase() === toEmail.toLowerCase())) {
    //   const ack = await resend.emails.send({
    //     from: ackFromEmail,
    //     to: [safeEmail],
    //     subject: "We received your message — GTek Engineering",
    //     text: [
    //       `Hi ${safeName},`,
    //       "",
    //       "Thanks for reaching out to GTek Engineering. We’ve received your message and will get back to you as soon as possible.",
    //       "",
    //       "— GTek Engineering",
    //     ].join("\n"),
    //   });

    //   if (ack.error) {
    //     console.error("Resend acknowledgement send failed:", ack.error);
    //   }
    // }
    
  } catch (err) {
    console.error("Contact send threw:", err);
    const detail = err instanceof Error ? err.message : resendErrorDetail(err);
    return NextResponse.json({ message: resendUserMessage(detail) }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks — your message was sent." }, { status: 200 });
}

function resendUserMessage(detail: string) {
  const d = detail.trim();
  if (/domain is not verified|not verified for this account/i.test(d)) {
    return "Email could not be sent: the From address must use a Resend-verified domain (or onboarding@resend.dev for tests).";
  }
  if (/only send testing emails|own email address/i.test(d)) {
    return "Email could not be sent: the Resend test sender can only deliver to the email on your Resend account. Verify gtekeng.com at resend.com/domains, then set CONTACT_FROM_EMAIL to an address on that domain (e.g. noreply@gtekeng.com).";
  }
  if (/invalid.*\bfrom\b|from field/i.test(d)) {
    return "Email could not be sent: check CONTACT_FROM_EMAIL on the server (use GTek Website <noreply@gtekeng.com> on a verified domain).";
  }
  if (/invalid.*\bto\b|to field/i.test(d)) {
    return "Email could not be sent: check CONTACT_TO_EMAIL on the server (must be a valid inbox address).";
  }
  if (/api key|unauthorized|invalid token/i.test(d)) {
    return "Email could not be sent: RESEND_API_KEY is missing or invalid on the server.";
  }
  if (d.length > 0 && d.length <= 280 && !/stack|internal server/i.test(d)) {
    return `Email could not be sent: ${d}`;
  }
  return "Failed to send message. Please try again later.";
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

