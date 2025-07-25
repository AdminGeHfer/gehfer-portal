import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
      console.error('Admin verification failed for user:', user.id, adminError)
      throw new Error('Admin privileges required')
    }

    const { userId, password } = await req.json()
    console.log('Admin', user.id, 'attempting to reset password for user:', userId)

    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: password }
    )

    if (error) {
      console.error('Error resetting password:', error)
      throw error
    }

    console.log('Password reset successful for user:', userId)
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in admin-reset-password function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})