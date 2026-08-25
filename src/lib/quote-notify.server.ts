// Sends the internal "new quote request" notification.
// Email delivery is best-effort: the submission is already stored in the
// database, so a delivery failure must never fail the visitor's submission.

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
    const { sendTemplateEmail } = await import("./email-templates/send-email").catch(
      () => ({ sendTemplateEmail: null }) as never,
    );
    if (!sendTemplateEmail) return false;

    const result = await sendTemplateEmail("quote-request", NOTIFY_TO, {
      templateData: {
        name: payload.name,
        email: payload.email,
        brand: payload.brand,
        needs: payload.needs,
        budget: payload.budget || "",
      },
      idempotencyKey: `quote-request-${payload.id}`,
    });
    return result.sent;
  } catch (error) {
    console.error("Quote notification email failed:", error);
    return false;
  }
}
