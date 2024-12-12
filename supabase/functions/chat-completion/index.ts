import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatOpenAI } from "https://esm.sh/@langchain/openai@0.0.14";
import { HumanMessage, SystemMessage, AIMessage } from "https://esm.sh/@langchain/core@0.1.25/messages";
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
    const { messages, model = 'gpt-4o-mini', agentId, memory } = await req.json();

    // Fetch agent configuration if agentId is provided
    let agentConfig = null;
    if (agentId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: agent, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;
      agentConfig = agent;

      // Log agent usage
      await supabase.rpc('log_agent_event', {
        p_agent_id: agentId,
        p_conversation_id: messages[0]?.conversation_id,
        p_event_type: 'chat_request',
        p_configuration: agent,
        p_details: 'Agent configuration applied to chat request'
      });
    }

    const chat = new ChatOpenAI({
      modelName: agentConfig?.model_id || model,
      temperature: agentConfig?.temperature || 0.7,
      maxTokens: agentConfig?.max_tokens || 4000,
      topP: agentConfig?.top_p || 0.9,
    });

    const formattedMessages = messages.map((msg: { role: string; content: string; }) => {
      switch (msg.role) {
        case 'system':
          return new SystemMessage(msg.content);
        case 'user':
          return new HumanMessage(msg.content);
        case 'assistant':
          return new AIMessage(msg.content);
        default:
          throw new Error(`Unknown message role: ${msg.role}`);
      }
    });

    // Add system prompt if configured
    if (agentConfig?.system_prompt) {
      formattedMessages.unshift(new SystemMessage(agentConfig.system_prompt));
    }

    // Add memory context if available
    if (memory?.history) {
      const memoryContext = `Previous conversation context:\n${memory.history}`;
      formattedMessages.unshift(new SystemMessage(memoryContext));
    }

    const response = await chat.call(formattedMessages);

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              role: 'assistant',
              content: response.content,
            },
          },
        ],
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});