import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Email Function Started ===");
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("CRITICAL ERROR: RESEND_API_KEY is not configured");
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Parsing email request body");
    const emailRequest: EmailRequest = await req.json();
    console.log("Email request data:", {
      from: emailRequest.from,
      to: emailRequest.to,
      subject: emailRequest.subject,
      htmlLength: emailRequest.html?.length || 0
    });

    console.log("Sending request to Resend API");
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
    console.log("Resend API response status:", res.status);
    console.log("Resend API response:", responseData);

    if (res.ok) {
      console.log("Email sent successfully");
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Error response from Resend API:", responseData);
      return new Response(JSON.stringify({ error: responseData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Critical error in send-workflow-email function:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    console.log("=== Email Function Completed ===");
  }
};

serve(handler);