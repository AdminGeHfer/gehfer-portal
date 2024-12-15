import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { messages, agentId, model = 'gpt-4o-mini' } = await req.json();
    console.log('Processing request:', { messages, agentId, model });

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

    // Get agent configuration if agentId is provided
    let systemPrompt = 'You are a helpful AI assistant.';
    if (agentId) {
      const { data: agent, error: agentError } = await supabaseClient
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (agentError) {
        console.error('Error fetching agent:', agentError);
        throw agentError;
      }

      if (agent?.system_prompt) {
        systemPrompt = agent.system_prompt;
      }
    }

    // Prepare messages for OpenAI
    const formattedMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ];

    console.log('Sending request to OpenAI with messages:', formattedMessages);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await openAIResponse.json();
    console.log('OpenAI response:', completion);

    // Log the interaction if agentId is provided
    if (agentId) {
      await supabaseClient.rpc('log_agent_event', {
        p_agent_id: agentId,
        p_event_type: 'completion',
        p_configuration: {
          model,
          temperature: 0.7,
          max_tokens: 1000
        },
        p_details: `Query: ${messages[messages.length - 1].content}\nResponse: ${completion.choices[0].message.content}`
      });
    }

    return new Response(
      JSON.stringify(completion),
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