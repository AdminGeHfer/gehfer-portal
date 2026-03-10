import { createClient } from '@supabase/supabase-js'
import { getCorsHeaders, handleCors } from '../_shared/cors.ts'
import { checkRateLimit, getRateLimitKey } from '../_shared/rateLimit.ts'

Deno.serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    )
  }

  const limit = checkRateLimit(getRateLimitKey(req), 10, 60_000)
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
    )
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    // Create client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create client with user's token for verification
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // Verify the requesting user is authenticated
    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      throw new Error('Invalid authentication token')
    }

    // Verify the requesting user has admin role
    const { data: isAdmin, error: adminError } = await supabase.rpc('verify_admin_role', {
      user_id: user.id
    })

    if (adminError || !isAdmin) {
      console.error('Admin verification failed')
      throw new Error('Admin privileges required')
    }

    const { userId, password } = await req.json()
    if (typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) {
      throw new Error("Invalid target user id");
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      throw new Error("Invalid password policy");
    }

    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: password }
    )

    if (error) {
      console.error('Error resetting password:', error)
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in admin-reset-password function', error)
    return new Response(JSON.stringify({ error: "Failed to reset password" }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
