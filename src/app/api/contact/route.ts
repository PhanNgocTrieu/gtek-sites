import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSanityClient } from "@/sanity/client";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clamp(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
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

  console.log("name ${name}, company: ${company}, email: ${email}, message: ${message}, subject: ${subject}, website: ${website}");

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

  // tracing log
  console.log("Sending contact email from:", safeEmail, "to:", process.env.CONTACT_TO_EMAIL, "subject:", safeSubject);

  const apiKey = process.env.RESEND_API_KEY;
  const envToEmail = process.env.CONTACT_TO_EMAIL?.trim();
  let toEmail = envToEmail || "contact@gtekengineering.ca";
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || "GTek Website <onboarding@resend.dev>";
  const ackFromEmail = process.env.CONTACT_ACK_FROM_EMAIL?.trim() || fromEmail;
  const sendAck = true;

  // Production: Sanity contactEmail wins when set.
  // Development: keep an explicit CONTACT_TO_EMAIL so local Resend tests can
  // land in the tester inbox (the Resend test sender only delivers to the account email).
  if (process.env.NODE_ENV === "production" || !envToEmail) {
    try {
      const client = getSanityClient({ useCdn: true });
      if (client) {
        const siteSettings = await client.fetch(`*[_type=="siteSettings" && _id=="siteSettings"][0]{ contactEmail }`);
        if (siteSettings?.contactEmail) {
          toEmail = siteSettings.contactEmail;
        }
      }
    } catch {
      // ignore and fallback to env/default
    }
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "Email service is not configured yet. Please email contact@gtekengineering.ca directly (RESEND_API_KEY missing).",
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
      console.error("Resend inquiry send failed:", inquiry.error);
      return NextResponse.json(
        { message: resendUserMessage(inquiry.error.message) },
        { status: 502 },
      );
    }

    if (sendAck) {
      const ack = await resend.emails.send({
        from: ackFromEmail,
        to: [safeEmail],
        subject: "We received your message — GTek Engineering",
        text: [
          `Hi ${safeName},`,
          "",
          "Thanks for reaching out to GTek Engineering. We’ve received your message and will get back to you as soon as possible.",
          "",
          "— GTek Engineering",
        ].join("\n"),
      });

      if (ack.error) {
        console.error("Resend acknowledgement send failed:", ack.error);
      }
    }
  } catch {
    return NextResponse.json({ message: "Failed to send message. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks — your message was sent." }, { status: 200 });
}

function resendUserMessage(detail: string) {
  if (/domain is not verified/i.test(detail)) {
    return "Email could not be sent: the From address must use a Resend-verified domain (or onboarding@resend.dev for local tests).";
  }
  if (/only send testing emails/i.test(detail)) {
    return "Email could not be sent: the Resend test sender can only deliver to the email on your Resend account.";
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

