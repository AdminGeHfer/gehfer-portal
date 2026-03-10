import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireServiceRoleToken } from "../_shared/auth.ts";
import { checkRateLimit, getRateLimitKey } from "../_shared/rateLimit.ts";

const EMAIL_PROVIDER = (Deno.env.get("EMAIL_PROVIDER") ?? "n8n").toLowerCase();
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL");
const N8N_WEBHOOK_TOKEN = Deno.env.get("N8N_WEBHOOK_TOKEN");

interface EmailRequest {
  from?: string;
  to: string[];
  subject: string;
  html: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const handler = async (req: Request): Promise<Response> => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  if (!requireServiceRoleToken(req)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  const limit = checkRateLimit(getRateLimitKey(req), 20, 60_000);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: {
          ...getCorsHeaders(req),
          "Content-Type": "application/json",
          "Retry-After": String(limit.retryAfterSec),
        },
      },
    );
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    if (
      !emailRequest ||
      !Array.isArray(emailRequest.to) ||
      emailRequest.to.length === 0 ||
      emailRequest.to.some((toEmail) => !isValidEmail(toEmail)) ||
      typeof emailRequest.subject !== "string" ||
      emailRequest.subject.trim().length < 3 ||
      emailRequest.subject.length > 200 ||
      typeof emailRequest.html !== "string" ||
      emailRequest.html.length > 200_000
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid email payload" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (EMAIL_PROVIDER === "n8n") {
      if (!N8N_WEBHOOK_URL) {
        throw new Error("N8N_WEBHOOK_URL is not configured");
      }

      const webhookHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (N8N_WEBHOOK_TOKEN) {
        webhookHeaders["x-webhook-token"] = N8N_WEBHOOK_TOKEN;
      }

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: webhookHeaders,
        body: JSON.stringify({
          ...emailRequest,
          provider: "gmail",
          source: "supabase-send-workflow-email",
          sent_at: new Date().toISOString(),
        }),
      });

      const responseText = await res.text();
      let responseData: unknown = {};
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { raw: responseText };
      }

      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: "N8N webhook request failed", details: responseData }),
          {
            status: 502,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ success: true, provider: "n8n", data: responseData }), {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    if (EMAIL_PROVIDER !== "resend") {
      throw new Error("Invalid EMAIL_PROVIDER. Supported values: n8n, resend");
    }

    if (!emailRequest.from || !isValidEmail(emailRequest.from)) {
      return new Response(
        JSON.stringify({ error: "Invalid email payload: 'from' is required for EMAIL_PROVIDER=resend" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured for EMAIL_PROVIDER=resend");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: emailRequest.from,
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    const responseData = await res.json();
    console.log("Resend API response:", responseData);

    if (res.ok) {
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    } else {
      console.error("Error from Resend API");
      return new Response(JSON.stringify({ error: responseData }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in send-workflow-email function", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
};

serve(handler);
