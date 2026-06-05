"use server";

import { sendContactEmail, sendAutoReply, type ContactPayload } from "@/lib/email";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LIMITS = {
  fullName: 120,
  company: 120,
  email: 254,
  phone: 30,
  service: 120,
  route: 200,
  description: 2000,
} as const;

export async function sendContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_RECEIVER_EMAIL) {
    console.error("[sendContactAction] Missing required env vars: RESEND_API_KEY or CONTACT_RECEIVER_EMAIL");
    return { success: false, message: "Server misconfiguration." };
  }

  const raw = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    service: String(formData.get("service") ?? "").trim(),
    route: String(formData.get("route") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };

  if (!raw.fullName || !raw.email) {
    return { success: false, message: "Full name and email are required." };
  }

  if (!EMAIL_RE.test(raw.email)) {
    return { success: false, message: "Invalid email address." };
  }

  const fields: ContactPayload = {
    fullName: raw.fullName.slice(0, FIELD_LIMITS.fullName),
    company: raw.company.slice(0, FIELD_LIMITS.company),
    email: raw.email.slice(0, FIELD_LIMITS.email),
    phone: raw.phone.slice(0, FIELD_LIMITS.phone),
    service: raw.service.slice(0, FIELD_LIMITS.service),
    route: raw.route.slice(0, FIELD_LIMITS.route),
    description: raw.description.slice(0, FIELD_LIMITS.description),
  };

  try {
    await sendContactEmail(fields);
  } catch (err) {
    console.error("[sendContactAction] sendContactEmail failed:", err);
    return { success: false, message: "Failed to send. Please try again." };
  }

  sendAutoReply(fields).catch((err) => {
    console.error("[sendContactAction] sendAutoReply failed:", err);
  });

  return { success: true, message: "Inquiry sent successfully." };
}
