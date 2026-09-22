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

/** Trim, unquote, and drop an inline `# comment`. Does not remove spaces inside the value. */
function readEnv(name: string): string {
  const raw = process.env[name];
  if (typeof raw !== "string") return "";
  let value = raw.trim().replace(/^\uFEFF/, "");
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  const commentAt = value.search(/\s+#/);
  if (commentAt !== -1) value = value.slice(0, commentAt).trim();
  return value;
}

/**
 * Resend rejects the whole token if quotes, a `Bearer ` prefix, or
 * `RESEND_API_KEY=` were stored as part of the value. Whitespace alone is
 * not a valid character in a Resend key.
 */
function readResendApiKey(): string {
  let key = readEnv("RESEND_API_KEY");
  key = key.replace(/^RESEND_API_KEY=/i, "").trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  key = key.replace(/^Bearer\s+/i, "");
  return key.replace(/\s+/g, "");
}

function resendErrorParts(error: unknown): { detail: string; name: string; statusCode: number | null } {
  if (!error || typeof error !== "object") {
    return { detail: String(error ?? ""), name: "", statusCode: null };
  }
  const e = error as { message?: unknown; name?: unknown; statusCode?: unknown };
  const detail = typeof e.message === "string" ? e.message : JSON.stringify(error);
  const name = typeof e.name === "string" ? e.name : "";
  const statusCode = typeof e.statusCode === "number" ? e.statusCode : null;
  return { detail, name, statusCode };
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

  const apiKey = readResendApiKey();
  const envToEmail = readEnv("CONTACT_TO_EMAIL");
  const defaultToEmail = siteConfig.settings.contact.contactEmail;
  let toEmail = envToEmail || defaultToEmail;
  const fromEmail = normalizeResendFrom(
    readEnv("CONTACT_FROM_EMAIL") || "GTek Website <noreply@gtekeng.com>",
  );
  // const ackFromEmail = process.env.CONTACT_ACK_FROM_EMAIL?.trim() || fromEmail;
  // const sendAck = (process.env.CONTACT_SEND_ACK ?? "").trim().toLowerCase() === "true";

  // Prefer Sanity so editors can change the inbox (and test on production) without a redeploy.
  // Contact page → Form recipient, then Site settings fallback, then CONTACT_TO_EMAIL / config.js.
  try {
    const client = getSanityClient({ useCdn: false });
    if (client) {
      const cms = await client.fetch<{
        contactToEmail?: string | null;
        contactEmail?: string | null;
      }>(
        `{
          "contactToEmail": *[_type=="contactPage" && _id=="contactPage"][0].contactToEmail,
          "contactEmail": *[_type=="siteSettings" && _id=="siteSettings"][0].contactEmail
        }`,
      );
      toEmail = coalesceText(
        cms?.contactToEmail,
        coalesceText(cms?.contactEmail, toEmail),
      );
    }
  } catch {
    // ignore and fallback to env/default
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
      const parsed = resendErrorParts(inquiry.error);
      console.error("Resend inquiry send failed:", {
        name: parsed.name,
        statusCode: parsed.statusCode,
        message: parsed.detail,
        resendKeyLength: apiKey.length,
        resendKeyHasRePrefix: apiKey.startsWith("re_"),
      });
      return NextResponse.json({ message: resendUserMessage(parsed.detail, parsed.name) }, { status: 502 });
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
    const parsed = err instanceof Error
      ? { detail: err.message, name: err.name }
      : resendErrorParts(err);
    return NextResponse.json({ message: resendUserMessage(parsed.detail, parsed.name) }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks — your message was sent." }, { status: 200 });
}

function isInvalidResendKeyError(detail: string, name: string) {
  if (name === "missing_api_key" || name === "invalid_api_key" || name === "suspended_api_key") return true;
  if (name === "restricted_api_key" && /not active|suspended/i.test(detail)) return true;
  return (
    /^api key is invalid\b/i.test(detail) ||
    /missing api key/i.test(detail) ||
    /api key is not active/i.test(detail) ||
    /api key is suspended/i.test(detail)
  );
}

function resendUserMessage(detail: string, name = "") {
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
  if (isInvalidResendKeyError(d, name)) {
    return "Email could not be sent: RESEND_API_KEY is missing or invalid on the server.";
  }
  if (/restricted to only send emails/i.test(d)) {
    return "Email could not be sent: this Resend key is send-only and cannot call that API. Sending contact mail does not need Full access. Create a Sending access key and set RESEND_API_KEY to it.";
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

