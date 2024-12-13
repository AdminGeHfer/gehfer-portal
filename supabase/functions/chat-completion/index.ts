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
    const { messages, model = 'gpt-4o-mini', agentId, memory, query } = await req.json();

    console.log('Received request with agentId:', agentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch agent configuration
    let agentConfig = null;
    let relevantDocs = [];
    
    if (agentId) {
      console.log('Fetching agent configuration...');
      const { data: agent, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;
      agentConfig = agent;

      // If agent uses knowledge base, search for relevant documents
      if (agentConfig.use_knowledge_base && query) {
        const openai = new OpenAIApi(new Configuration({
          apiKey: Deno.env.get('OPENAI_API_KEY'),
        }));

        const embedding = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: query,
        });

        const { data: docs, error: searchError } = await supabase.rpc('match_documents', {
          query_embedding: embedding.data.data[0].embedding,
          match_threshold: agentConfig.search_threshold,
          match_count: 5
        });

        if (searchError) throw searchError;
        relevantDocs = docs;
      }
    }

    // Initialize chat model
    const chat = new ChatOpenAI({
      modelName: agentConfig?.model_id || model,
      temperature: agentConfig?.temperature || 0.7,
      maxTokens: agentConfig?.max_tokens || 4000,
      topP: agentConfig?.top_p || 0.9,
    });

    // Prepare messages array
    const formattedMessages = [];

    // Add system prompt and knowledge context
    if (agentConfig?.system_prompt) {
      let systemPrompt = agentConfig.system_prompt;
      
      if (relevantDocs.length > 0) {
        const context = relevantDocs
          .map(doc => `Content: ${doc.content}\nSource: ${doc.metadata?.filename || 'Unknown'}`)
          .join('\n\n');
        
        systemPrompt += `\n\nRelevant context from knowledge base:\n${context}`;
      }
      
      formattedMessages.push(new SystemMessage(systemPrompt));
    }

    // Add memory context
    if (memory?.history) {
      const memoryMessages = memory.history
        .map((msg: any) => {
          if (msg.type === 'message') {
            return msg.metadata.role === 'user' 
              ? new HumanMessage(msg.content)
              : new AIMessage(msg.content);
          }
          return null;
        })
        .filter(Boolean);
      
      formattedMessages.push(...memoryMessages);
    }

    // Add current messages
    messages.forEach((msg: { role: string; content: string; }) => {
      switch (msg.role) {
        case 'system':
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

    const response = await chat.call(formattedMessages);

    // Log the interaction
    await supabase.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_event_type: 'chat_completion',
      p_configuration: {
        model: agentConfig?.model_id || model,
        relevantDocsCount: relevantDocs.length,
        messageCount: formattedMessages.length
      },
      p_details: 'Chat completion with knowledge base integration'
    });

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
        knowledgeBase: {
          used: relevantDocs.length > 0,
          sourcesCount: relevantDocs.length,
          sources: relevantDocs.map(doc => ({
            filename: doc.metadata?.filename,
            similarity: doc.similarity
          }))
        }
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
