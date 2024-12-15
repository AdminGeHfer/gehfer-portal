import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentId } = await req.json();
    console.log('Processing request:', { message, agentId });

    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get agent configuration
    const { data: agent, error: agentError } = await supabaseClient
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) {
      console.error('Error fetching agent:', agentError);
      throw agentError;
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: agent.system_prompt || 'You are a helpful AI assistant.'
      },
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Sending request to OpenAI with messages:', messages);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agent.model_id || 'gpt-4o-mini',
        messages,
        temperature: agent.temperature || 0.7,
        max_tokens: agent.max_tokens || 4000,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await openAIResponse.json();
    console.log('OpenAI response:', completion);

    // Log the interaction
    await supabaseClient.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_event_type: 'completion',
      p_configuration: {
        model: agent.model_id,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens
      },
      p_details: `Query: ${message}\nResponse: ${completion.choices[0].message?.content}`
    });

    return new Response(
      JSON.stringify({ response: completion.choices[0].message?.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});