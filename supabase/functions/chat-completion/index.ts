import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ChatOpenAI } from "npm:@langchain/openai";
import { ConversationChain } from "npm:langchain/chains";
import { BufferMemory, ConversationSummaryMemory } from "npm:langchain/memory";
import { ChatMessageHistory } from "npm:langchain/memory";
import { PromptTemplate } from "npm:@langchain/core/prompts";
import { HumanMessage, AIMessage, SystemMessage } from "npm:@langchain/core/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Request received');
    const { messages, model = 'gpt-4o-mini', agentId } = await req.json();
    console.log('Request params:', { model, agentId, messageCount: messages.length });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Fetch agent configuration
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
        throw new Error('Failed to fetch agent configuration');
      }
      
      if (data) {
        agentConfig = data;
        console.log('Agent config found:', {
          name: agentConfig.name,
          memoryType: agentConfig.memory_type,
          temperature: agentConfig.temperature,
          systemPrompt: agentConfig.system_prompt,
        });

        // Log agent configuration
        await supabaseClient.rpc('log_agent_event', {
          p_agent_id: agentId,
          p_conversation_id: messages[0]?.conversation_id,
          p_event_type: 'configuration_loaded',
          p_configuration: agentConfig,
        });
      }
    }

    // Initialize message history
    const history = new ChatMessageHistory();
    for (const msg of messages) {
      if (msg.role === 'system') {
        await history.addMessage(new SystemMessage(msg.content));
      } else if (msg.role === 'user') {
        await history.addMessage(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        await history.addMessage(new AIMessage(msg.content));
      }
    }

    // Create memory system based on agent config
    let memory;
    if (agentConfig?.memory_type === 'summary') {
      console.log('Using ConversationSummaryMemory');
      memory = new ConversationSummaryMemory({
        llm: new ChatOpenAI({ 
          modelName: "gpt-4o-mini",
          temperature: 0,
          openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
        }),
        chatHistory: history,
        returnMessages: true,
        memoryKey: "chat_history",
      });
    } else {
      console.log('Using BufferMemory');
      memory = new BufferMemory({
        chatHistory: history,
        returnMessages: true,
        memoryKey: "chat_history",
      });
    }

    // Initialize LLM with agent config
    const llm = new ChatOpenAI({
      modelName: model === 'gpt-4o-mini' ? 'gpt-3.5-turbo' : 'gpt-4',
      temperature: agentConfig?.temperature ?? 0.7,
      maxTokens: agentConfig?.max_tokens ?? 1000,
      topP: agentConfig?.top_p ?? 1,
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Detect language from user input
    const lastMessage = messages[messages.length - 1].content;
    const languagePrompt = `Determine the language of the following text and respond with just the language code (e.g., 'pt' for Portuguese, 'en' for English): "${lastMessage}"`;
    
    const languageResponse = await llm.call([new HumanMessage(languagePrompt)]);
    const detectedLanguage = languageResponse.content.toLowerCase().trim();
    
    console.log('Detected language:', detectedLanguage);

    // Create prompt template with agent config and language
    const basePrompt = agentConfig?.system_prompt || 'You are a helpful assistant.';
    const languageInstruction = detectedLanguage.includes('pt') 
      ? 'Responda sempre em português do Brasil de forma clara e profissional.'
      : 'Respond in the same language as the user\'s message.';

    const promptTemplate = PromptTemplate.fromTemplate(`
      ${basePrompt}
      ${languageInstruction}
      
      Current conversation:
      {chat_history}
      
      Human: {input}
      Assistant: Let me help you with that.
    `);

    // Create conversation chain
    const chain = new ConversationChain({
      llm,
      memory,
      prompt: promptTemplate,
    });

    // Log conversation start
    await supabaseClient.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_conversation_id: messages[0]?.conversation_id,
      p_event_type: 'conversation_started',
      p_details: `Language: ${detectedLanguage}, Model: ${model}`,
    });

    // Get the last message and execute chain
    const response = await chain.call({ input: lastMessage });
    console.log('Chain response received');

    // Log successful response
    await supabaseClient.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_conversation_id: messages[0]?.conversation_id,
      p_event_type: 'response_generated',
      p_details: `Success - Tokens used: ${response?.tokens || 'N/A'}`,
    });

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: response.response
          }
        }]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat completion:', error);
    
    // Log error event
    const { messages, agentId } = await req.json();
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    await supabaseClient.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_conversation_id: messages[0]?.conversation_id,
      p_event_type: 'error',
      p_details: error.message,
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});