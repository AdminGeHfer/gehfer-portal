import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const groqApiKey = Deno.env.get('GROQ_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getAgentConfig(agentId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  console.log('Fetching agent configuration for ID:', agentId);
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error) {
    console.error('Error fetching agent config:', error);
    throw error;
  }

  console.log('Retrieved agent configuration:', data);
  return data;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = 'gpt-4o-mini', agentId } = await req.json();
    console.log('Processing chat completion request:', { messageCount: messages.length, model, agentId });

    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    // Get agent configuration
    const agentConfig = await getAgentConfig(agentId);
    console.log('Using agent configuration:', agentConfig);

    // Prepare messages array with system prompt from agent config
    const systemMessage = {
      role: 'system',
      content: agentConfig.system_prompt || 'You are a helpful assistant.'
    };

    // Use agent's configuration for the API call
    const apiConfig = {
      model: agentConfig.model_id || model,
      messages: [systemMessage, ...messages],
      temperature: agentConfig.temperature,
      max_tokens: agentConfig.max_tokens,
      top_p: agentConfig.top_p,
      top_k: agentConfig.top_k,
      stop: agentConfig.stop_sequences,
    };

    console.log('Sending request with config:', apiConfig);

    if (apiConfig.model.startsWith('groq-')) {
      if (!groqApiKey) {
        throw new Error('Groq API key not configured');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiConfig),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Groq API error:', error);
        throw new Error(`Groq API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiConfig),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});