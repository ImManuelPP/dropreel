// Sends the internal "new quote request" notification email.
// Delivery is best-effort: the submission is already stored in the database,
// so a delivery failure must never fail the visitor's submission.

import { sendTemplateEmail } from "./email-templates/send-email";

export const NOTIFY_TO = "srpareja20@gmail.com";

type QuotePayload = {
  id: string;
  name: string;
  email: string;
  brand: string;
  needs: string;
  budget?: string;
};

export async function notifyQuoteRequest(payload: QuotePayload): Promise<boolean> {
  try {
    const result = await sendTemplateEmail("quote-notification", NOTIFY_TO, {
      templateData: { ...payload },
      idempotencyKey: `quote-notification-${payload.id}`,
      replyTo: payload.email,
    });
    if (!result.sent) {
      console.warn("Quote notification not sent:", result.reason, payload.id);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send quote notification email:", error);
    return false;
  }
}
