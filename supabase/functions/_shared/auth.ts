import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

type AuthenticatedUser = {
  id: string;
  email?: string | null;
};

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function requireAuthenticatedUser(
  req: Request,
): Promise<AuthenticatedUser | null> {
  const token = getBearerToken(req);
  if (!token) return null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;

  return {
    id: data.user.id,
    email: data.user.email,
  };
}

export function requireServiceRoleToken(req: Request): boolean {
  const authToken = getBearerToken(req);
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const internalJobToken = Deno.env.get("INTERNAL_JOB_TOKEN");
  const headerJobToken = req.headers.get("x-job-token");

  if (internalJobToken && headerJobToken === internalJobToken) {
    return true;
  }

  if (!serviceRoleKey || !authToken) return false;
  return authToken === serviceRoleKey;
}
