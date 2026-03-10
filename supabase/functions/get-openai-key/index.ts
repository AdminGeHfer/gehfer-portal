import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireServiceRoleToken } from "../_shared/auth.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (!requireServiceRoleToken(req)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      error: "Endpoint disabled for security reasons",
      code: "ENDPOINT_DEPRECATED",
    }),
    {
      status: 410,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    },
  );
});
