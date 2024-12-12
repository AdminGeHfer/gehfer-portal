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

    console.log('Received request with agentId:', agentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch agent configuration if agentId is provided
    let agentConfig = null;
    if (agentId) {
      console.log('Fetching agent configuration...');
      const { data: agent, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        throw error;
      }

      agentConfig = agent;
      console.log('Agent configuration:', agentConfig);

      // Log agent usage
      await supabase.rpc('log_agent_event', {
        p_agent_id: agentId,
        p_conversation_id: messages[0]?.conversation_id,
        p_event_type: 'chat_request',
        p_configuration: agentConfig,
        p_details: 'Agent configuration applied to chat request'
      });
    }

    // Initialize chat model with agent configuration if available
    const chat = new ChatOpenAI({
      modelName: agentConfig?.model_id || model,
      temperature: agentConfig?.temperature || 0.7,
      maxTokens: agentConfig?.max_tokens || 4000,
      topP: agentConfig?.top_p || 0.9,
    });

    // Prepare messages array starting with system prompt if available
    const formattedMessages = [];

    // Add system prompt as the first message if available
    if (agentConfig?.system_prompt) {
      console.log('Adding system prompt:', agentConfig.system_prompt);
      formattedMessages.push(new SystemMessage(agentConfig.system_prompt));
    }

    // Add memory context if available
    if (memory?.history) {
      console.log('Adding memory context');
      const memoryMessages = memory.history.map((msg: any) => {
        if (msg.type === 'message') {
          return msg.metadata.role === 'user' 
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content);
        }
        return null;
      }).filter(Boolean);
      formattedMessages.push(...memoryMessages);
    }

    // Add current messages
    messages.forEach((msg: { role: string; content: string; }) => {
      switch (msg.role) {
        case 'system':
          // Skip system messages as we already added our system prompt
          break;
        case 'user':
          formattedMessages.push(new HumanMessage(msg.content));
          break;
        case 'assistant':
          formattedMessages.push(new AIMessage(msg.content));
          break;
        default:
          console.warn(`Unknown message role: ${msg.role}`);
      }
    });

    console.log('Final message count:', formattedMessages.length);
    console.log('Messages being sent to OpenAI:', formattedMessages);

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