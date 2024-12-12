import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ChatOpenAI } from "npm:@langchain/openai";
import { ConversationChain } from "npm:langchain/chains";
import { BufferMemory, ConversationSummaryMemory } from "npm:langchain/memory";
import { ChatMessageHistory } from "npm:langchain/memory";
import { PromptTemplate } from "npm:@langchain/core/prompts";
import { HumanMessage, AIMessage, SystemMessage } from "npm:@langchain/core/messages";
import { DynamicTool, Tool } from "npm:@langchain/core/tools";
import { Calculator } from "npm:langchain/tools/calculator";
import { WebBrowser } from "npm:langchain/tools/webbrowser";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Tool definitions
const getToolsForAgent = (toolIds: string[]) => {
  const availableTools: { [key: string]: Tool } = {
    'calculator': new Calculator(),
    'web_search': new WebBrowser(),
    'rnc_search': new DynamicTool({
      name: "rnc_search",
      description: "Search for RNC information",
      func: async (query: string) => {
        console.log('RNC search query:', query);
        return "RNC search functionality will be implemented here";
      },
    }),
    'quality_analysis': new DynamicTool({
      name: "quality_analysis",
      description: "Analyze quality metrics",
      func: async (input: string) => {
        console.log('Quality analysis input:', input);
        return "Quality analysis functionality will be implemented here";
      },
    }),
  };

  return toolIds.map(id => availableTools[id]).filter(Boolean);
};

// Memory factory
const createMemory = async (type: string, history: any[], llm: ChatOpenAI) => {
  const messageHistory = new ChatMessageHistory();
  
  for (const msg of history) {
    if (msg.role === 'user') {
      await messageHistory.addMessage(new HumanMessage(msg.content));
    } else if (msg.role === 'assistant') {
      await messageHistory.addMessage(new AIMessage(msg.content));
    } else if (msg.role === 'system') {
      await messageHistory.addMessage(new SystemMessage(msg.content));
    }
  }

  console.log(`Creating ${type} memory with ${history.length} messages`);

  switch (type) {
    case 'summary':
      return new ConversationSummaryMemory({
        llm,
        chatHistory: messageHistory,
        returnMessages: true,
        memoryKey: "chat_history",
      });
    default:
      return new BufferMemory({
        chatHistory: messageHistory,
        returnMessages: true,
        memoryKey: "chat_history",
      });
  }
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

      if (error) throw error;
      if (data) {
        agentConfig = data;
        console.log('Agent config found:', {
          name: agentConfig.name,
          memoryType: agentConfig.memory_type,
          tools: agentConfig.tools,
        });
      }
    }

    // Initialize LLM
    const llm = new ChatOpenAI({
      modelName: model === 'gpt-4o-mini' ? 'gpt-3.5-turbo' : 'gpt-4',
      temperature: agentConfig?.temperature ?? 0.7,
      maxTokens: agentConfig?.max_tokens ?? 1000,
      topP: agentConfig?.top_p ?? 1,
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Create memory system
    const memory = await createMemory(
      agentConfig?.memory_type || 'buffer',
      messages,
      llm
    );

    // Create prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
      ${agentConfig?.system_prompt || 'You are a helpful assistant.'}
      
      Current conversation:
      {chat_history}
      
      Human: {input}
      Assistant: Let me help you with that.
    `);

    // Initialize tools if specified
    const tools = agentConfig?.tools ? getToolsForAgent(agentConfig.tools) : [];
    console.log('Initialized tools:', tools.map(t => t.name));

    // Create conversation chain
    const chain = new ConversationChain({
      llm,
      memory,
      prompt: promptTemplate,
    });

    // Get the last message
    const lastMessage = messages[messages.length - 1].content;
    console.log('Processing message:', lastMessage);

    // Execute chain
    const response = await chain.call({ input: lastMessage });
    console.log('Chain response received');

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});