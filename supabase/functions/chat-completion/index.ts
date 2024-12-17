import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, agentId } = await req.json();
    console.log('Received request:', { model, agentId, messageCount: messages?.length });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) {
      console.error('Error fetching agent:', agentError);
      throw new Error('Failed to fetch agent configuration');
    }

    console.log('Agent configuration:', {
      model: agent.model_id,
      systemPrompt: agent.system_prompt,
      temperature: agent.temperature
    });

    // Model mapping
    const modelMapping = {
      'gpt-4o': 'gpt-4',
      'gpt-4o-mini': 'gpt-4-0125-preview',
    };

    const openAIModel = modelMapping[model || agent.model_id] || 'gpt-4-0125-preview';
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare messages array with system prompt
    const systemMessages = [];
    if (agent.system_prompt) {
      systemMessages.push({ 
        role: 'system', 
        content: agent.system_prompt 
      });
    }

    // Combine system messages with conversation history
    const allMessages = [...systemMessages, ...messages];
    console.log('Sending messages to OpenAI:', allMessages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: allMessages,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens,
        top_p: agent.top_p,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI Error:', error);
      throw new Error(error.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        details: error.stack || 'No stack trace available'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});