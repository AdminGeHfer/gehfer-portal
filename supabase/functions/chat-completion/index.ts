import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getSupabaseClient } from "../_shared/supabaseClient.ts";
import { structureContext, validateChunks } from './contextUtils.ts';
import { generateEmbedding, getChatCompletion } from './openaiUtils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { messages, model, agentId } = await req.json();
    console.log('Received request:', { model, agentId, messageCount: messages?.length });

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format');
      throw new Error('Invalid messages format');
    }

    if (!agentId) {
      console.error('Agent ID is required');
      throw new Error('Agent ID is required');
    }

    const supabase = getSupabaseClient();

    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (agentError) {
      console.error('Error fetching agent:', agentError);
      throw agentError;
    }

    console.log('Agent configuration:', {
      useKnowledgeBase: agent?.use_knowledge_base,
      temperature: agent?.temperature,
      maxTokens: agent?.max_tokens
    });

    let relevantContext = '';

    if (agent?.use_knowledge_base) {
      try {
        const latestMessage = messages[messages.length - 1].content;
        console.log('Generating embedding for query:', latestMessage);
        
        const queryEmbedding = await generateEmbedding(openAIApiKey, latestMessage);

        if (!queryEmbedding) {
          console.error('No embedding generated');
          throw new Error('No embedding generated');
        }

        const searchThreshold = 0.8;
        console.log('Search threshold:', searchThreshold);
        
        const { data: chunks, error: searchError } = await supabase.rpc('match_document_chunks', {
          query_embedding: queryEmbedding,
          match_threshold: searchThreshold,
          match_count: 5
        });

        if (searchError) {
          console.error('Error searching chunks:', searchError);
          throw searchError;
        }

        if (chunks && chunks.length > 0) {
          const validChunks = validateChunks(chunks, searchThreshold);
          console.log(`Found ${validChunks.length} valid chunks out of ${chunks.length} total`);
          
          relevantContext = structureContext(validChunks);
          console.log('Structured context:', relevantContext);
        } else {
          console.log('No relevant chunks found');
        }
      } catch (error) {
        console.error('Error in knowledge base search:', error);
      }
    }

    const modelMapping: { [key: string]: string } = {
      'gpt-4o': 'gpt-4',
      'gpt-4o-mini': 'gpt-4o-mini',
      'gpt-3.5-turbo': 'gpt-3.5-turbo-16k'
    };

    const openAIModel = modelMapping[model] || 'gpt-3.5-turbo-16k';
    console.log(`Using model: ${model} -> ${openAIModel}`);

    const systemMessages = [
      { 
        role: 'system', 
        content: `${agent?.system_prompt}\n\nIMPORTANT: You can ONLY use classifications from this context:\n\n${relevantContext}\n\nIf you cannot find an EXACT match in the context above, respond with "Não encontrei classificação exata."` 
      }
    ];

    const completion = await getChatCompletion(
      openAIApiKey,
      [...systemMessages, ...messages],
      openAIModel,
      agent?.temperature || 0.7,
      agent?.max_tokens || 4000
    );

    // Log the interaction
    await supabase.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_event_type: 'completion',
      p_configuration: {
        model: openAIModel,
        temperature: agent?.temperature,
        max_tokens: agent?.max_tokens,
        knowledge_base_used: agent?.use_knowledge_base,
        documents_found: relevantContext ? 'yes' : 'no',
        context_length: relevantContext.length
      },
      p_details: `Response: ${completion.choices[0].message?.content}`
    });

    return new Response(JSON.stringify(completion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        details: error.stack || 'No stack trace available'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});