// Sends the internal "new quote request" notification.
// Email delivery is best-effort: the submission is already stored in the
// database, so a delivery failure must never fail the visitor's submission.
//
// Email templates are activated once the sender domain is configured.

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
  console.log("New quote request stored:", payload.id, payload.email);
  return false;
}
