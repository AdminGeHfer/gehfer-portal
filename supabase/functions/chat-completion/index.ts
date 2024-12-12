import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map model IDs to their OpenAI equivalents
const MODEL_MAPPING = {
  'gpt-4o-mini': 'gpt-4-turbo-preview',
  'gpt-4o': 'gpt-4-turbo-preview'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agentId } = await req.json();
    console.log('Processing chat completion request:', { messageCount: messages.length, agentId });

    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    // Get agent configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Fetching agent configuration for ID:', agentId);
    const { data: agentConfig, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) {
      console.error('Error fetching agent config:', agentError);
      throw agentError;
    }

    console.log('Retrieved agent configuration:', agentConfig);

    // Map the agent's model_id to OpenAI model
    const modelId = MODEL_MAPPING[agentConfig.model_id];
    if (!modelId) {
      throw new Error(`Invalid model ID: ${agentConfig.model_id}`);
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare system message from agent configuration
    const systemMessage = {
      role: 'system',
      content: agentConfig.system_prompt || 'You are a helpful assistant.'
    };

    console.log('Using OpenAI API with model:', modelId);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [systemMessage, ...messages],
        temperature: agentConfig.temperature,
        max_tokens: agentConfig.max_tokens,
        top_p: agentConfig.top_p,
        stop: agentConfig.stop_sequences,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.stack }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});