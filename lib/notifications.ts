import { Resend } from "resend";
import type { SubmissionRecord } from "./submissions";

export async function sendSubmissionNotification(entry: SubmissionRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL_TO;
  const from = process.env.NOTIFICATION_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return false;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to,
    subject: `New wellness submission from ${entry.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2e1a14; line-height: 1.6;">
        <h2 style="margin-bottom: 8px;">New submission received</h2>
        <p style="margin-top: 0;">A new inquiry has been submitted on the wellness website.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tr><td style="padding: 8px; font-weight: 700;">Name</td><td style="padding: 8px;">${entry.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Phone</td><td style="padding: 8px;">${entry.phone}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Email</td><td style="padding: 8px;">${entry.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Blood group</td><td style="padding: 8px;">${entry.bloodGroup}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Condition</td><td style="padding: 8px;">${entry.condition}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Batch type</td><td style="padding: 8px;">${entry.batchType}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Goal</td><td style="padding: 8px;">${entry.goal}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Notes</td><td style="padding: 8px;">${entry.notes || "-"}</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Submitted at</td><td style="padding: 8px;">${entry.createdAt}</td></tr>
        </table>
      </div>
    `
  });

  return true;
}
