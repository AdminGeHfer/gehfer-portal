import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { getCorsHeaders, handleCors } from '../_shared/cors.ts'
import { requireServiceRoleToken } from '../_shared/auth.ts'

Deno.serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  if (!requireServiceRoleToken(req)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    )
  }

// Inside the edge function
try {
  const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // First ensure days_left is up-to-date
  await supabaseClient.rpc('update_all_rnc_days_left')

  // Small delay to ensure update completes
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Get the intelligence user ID
  const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('email', 'inteligencia2@gehfer.com.br')
      .single()

  if (userError || !userData) {
      console.error('Error fetching intelligence user:', userError)
      throw new Error('Intelligence user not found')
  }

  // Get all active RNCs with their updated days_left
  const { data: rncs, error: rncsError } = await supabaseClient
      .from('rncs')
      .select('id, days_left')
      .neq('status', 'concluded')

  if (rncsError) {
      console.error('Error fetching RNCs:', rncsError)
      throw new Error('Failed to fetch RNCs')
  }

  // Create events for each RNC
  const eventPromises = rncs.map(rnc => {
      return supabaseClient
          .from('rnc_events')
          .insert({
              rnc_id: rnc.id,
              title: 'Dias Restantes',
              description: `Dias restantes da RNC: ${rnc.days_left}`,
              type: 'status',
              created_by: userData.id
          })
  })

  await Promise.all(eventPromises)
  console.log(`Created daily events for ${rncs.length} RNCs`)

    return new Response(
      JSON.stringify({ success: true, count: rncs.length }),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in daily-rnc-events')
    return new Response(
      JSON.stringify({ error: "Daily event generation failed" }),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
