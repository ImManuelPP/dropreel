import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  brand: z.string().trim().min(1, "Brand is required").max(150),
  needs: z.string().trim().min(1, "Please describe what you need").max(2000),
  budget: z.string().trim().max(200).optional().default(""),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const id = crypto.randomUUID();
    const { error } = await supabase
      .from("quote_requests")
      .insert({
        id,
        name: data.name,
        email: data.email,
        brand: data.brand,
        needs: data.needs,
        budget: data.budget || null,
      });

    if (error) {
      console.error("Failed to store quote request:", error);
      throw new Error("We couldn't save your request. Please try again.");
    }

    const { notifyQuoteRequest } = await import("./quote-notify.server");
    const notified = await notifyQuoteRequest({ ...data, id });

    return { ok: true as const, id, notified };
  });
