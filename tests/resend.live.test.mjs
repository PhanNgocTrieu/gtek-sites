import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { before, describe, test } from "node:test";
import { Resend } from "resend";

function loadEnvLocal() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) {
    throw new Error("Missing .env.local. Copy .env.local.example and set RESEND_API_KEY and CONTACT_TO_EMAIL.");
  }

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const stamp = new Date().toISOString();

function requireMailEnv() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || "GTek Website <onboarding@resend.dev>";
  assert.ok(apiKey, "Set RESEND_API_KEY in .env.local");
  assert.ok(toEmail, "Set CONTACT_TO_EMAIL in .env.local to the inbox you will check");
  return { apiKey, toEmail, fromEmail };
}

describe("Resend live mail", () => {
  before(() => {
    loadEnvLocal();
  });

  test("sends an inquiry email through the Resend API", async () => {
    const { apiKey, toEmail, fromEmail } = requireMailEnv();
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `[TEST] Resend inquiry ${stamp}`,
      text: `Resend live test (inquiry).\nSent at ${stamp}\n\nIf you see this, the API key works.`,
    });

    assert.equal(result.error, null, result.error ? JSON.stringify(result.error) : "");
    assert.ok(result.data?.id, "Resend did not return an email id");
    console.log(`Inquiry sent. Check ${toEmail} (Resend id ${result.data.id})`);
  });

  test("sends an acknowledgement email through the Resend API", async () => {
    const { apiKey, toEmail, fromEmail } = requireMailEnv();
    const ackFrom = process.env.CONTACT_ACK_FROM_EMAIL?.trim() || fromEmail;
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: ackFrom,
      to: [toEmail],
      subject: `[TEST] We received your message — GTek Engineering ${stamp}`,
      text: [
        "Hi Resend Test Runner,",
        "",
        "This is the acknowledgement email the contact form sends when CONTACT_SEND_ACK=true.",
        `Sent at ${stamp}`,
        "",
        "— GTek Engineering",
      ].join("\n"),
    });

    assert.equal(result.error, null, result.error ? JSON.stringify(result.error) : "");
    assert.ok(result.data?.id, "Resend did not return an email id");
    console.log(`Acknowledgement sent. Check ${toEmail} (Resend id ${result.data.id})`);
  });
});
