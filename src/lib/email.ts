import { createResendClient } from "@/lib/resend";

// Verified Resend domain: equinoxint.net. Override per-environment with RESEND_FROM_EMAIL.

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "forms@equinoxint.net";

export interface ContactPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  route: string;
  description: string;
}

function notificationHtml(data: ContactPayload): string {
  const ts = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  });

  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#666;white-space:nowrap;border-bottom:1px solid #f0f0f0;width:140px;">${label}</td>
          <td style="padding:10px 16px;font-size:15px;color:#1a1a1a;border-bottom:1px solid #f0f0f0;">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#cc1020;padding:28px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.7);">New Inquiry</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Equinox International</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
              A new shipment inquiry was submitted via the website contact form.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;">
              ${row("Full Name", data.fullName)}
              ${row("Company", data.company)}
              ${row("Email", data.email)}
              ${row("Phone", data.phone)}
              ${row("Service", data.service)}
              ${row("Route", data.route)}
            </table>

            ${
              data.description
                ? `<div style="margin-top:24px;padding:20px;background:#fafafa;border-radius:8px;border:1px solid #f0f0f0;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888;">Description</p>
                    <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.65;white-space:pre-wrap;">${data.description}</p>
                  </div>`
                : ""
            }
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f0;background:#fafafa;">
            <p style="margin:0;font-size:12px;color:#999;">Submitted ${ts} (Cairo)</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function autoReplyHtml(data: ContactPayload): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#cc1020;padding:28px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.7);">Inquiry Received</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Equinox International</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1a1a1a;font-weight:600;">Hello ${data.fullName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              Thank you for reaching out. We have received your inquiry and a member of our operations team will respond within <strong>one business day</strong>.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#444;line-height:1.7;">
              If your shipment is time-sensitive, feel free to contact us directly via WhatsApp or phone.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#cc1020;border-radius:100px;padding:13px 24px;">
                  <a href="https://equinoxint.net" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">Visit equinoxint.net</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f0;background:#fafafa;">
            <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
              Equinox International · 26 Mohamed Kamel Hussein St., New Nozha, Cairo, Egypt<br>
              This is an automated confirmation — please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const resend = createResendClient();
  const { error } = await resend.emails.send({
    from: `Equinox Website <${FROM_EMAIL}>`,
    to: [process.env.CONTACT_RECEIVER_EMAIL!],
    replyTo: data.email,
    subject: `New inquiry from ${data.fullName}${data.company ? ` · ${data.company}` : ""}`,
    html: notificationHtml(data),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendAutoReply(data: ContactPayload): Promise<void> {
  const resend = createResendClient();
  await resend.emails.send({
    from: `Equinox International <${FROM_EMAIL}>`,
    to: [data.email],
    subject: "We received your inquiry — Equinox International",
    html: autoReplyHtml(data),
  });
}
