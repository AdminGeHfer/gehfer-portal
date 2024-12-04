import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("GMAIL_CLIENT_SECRET");
const REFRESH_TOKEN = Deno.env.get("GMAIL_REFRESH_TOKEN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
}

async function getAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function sendGmail(accessToken: string, to: string[], subject: string, html: string) {
  const emailContent = [
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `To: ${to.join(", ")}`,
    `Subject: ${subject}`,
    "",
    html,
  ].join("\r\n");

  const encodedEmail = btoa(emailContent).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Gmail Send Function Started ===");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      console.error("Gmail credentials not configured");
      throw new Error("Gmail credentials not configured");
    }

    const emailRequest: EmailRequest = await req.json();
    console.log("Email request received:", {
      to: emailRequest.to,
      subject: emailRequest.subject,
      htmlLength: emailRequest.html?.length || 0,
    });

    const accessToken = await getAccessToken();
    console.log("Access token obtained successfully");

    const result = await sendGmail(
      accessToken,
      emailRequest.to,
      emailRequest.subject,
      emailRequest.html
    );

    console.log("Email sent successfully:", result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);