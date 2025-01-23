import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

    // Get all active RNCs
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in daily-rnc-events:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})