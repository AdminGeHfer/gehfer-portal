import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const VALID_MODELS = ['gpt-4o-mini', 'gpt-4o'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = 'gpt-4o-mini', agentId } = await req.json();
    console.log('Received request with model:', model);

    if (!VALID_MODELS.includes(model)) {
      return new Response(
        JSON.stringify({
          error: `Invalid model ID: ${model}`,
          validModels: VALID_MODELS,
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let agentConfig = null;
    if (agentId) {
      console.log('Fetching agent config for ID:', agentId);
      const { data, error } = await supabaseClient
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) {
        console.error('Error fetching agent config:', error);
        throw error;
      }

      if (data) {
        agentConfig = data;
        console.log('Found agent config:', agentConfig);
      }
    }

    const modelId = model === 'gpt-4o-mini' ? 'gpt-3.5-turbo' : 'gpt-4';
    console.log('Mapped model ID:', modelId);

    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Making request to OpenAI with model:', modelId);

    const systemMessage = {
      role: 'system',
      content: agentConfig?.system_prompt || 'Você é um assistente útil.'
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [systemMessage, ...messages],
        temperature: agentConfig?.temperature ?? 0.7,
        max_tokens: agentConfig?.max_tokens ?? 1000,
        top_p: agentConfig?.top_p ?? 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    console.log('OpenAI response received');

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});