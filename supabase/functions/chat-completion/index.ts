import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved validation for chunk relevance
const validateChunks = (chunks: any[], threshold: number = 0.8) => {
  return chunks.filter(chunk => {
    // Filter by similarity threshold
    if (chunk.similarity < threshold) {
      console.log(`Chunk filtered out due to low similarity: ${chunk.similarity}`);
      return false;
    }
    // Additional validation could be added here
    return true;
  });
};

// Better context structuring
const structureContext = (chunks: any[]) => {
  if (!chunks || chunks.length === 0) return '';
  
  // Sort chunks by similarity
  const sortedChunks = chunks.sort((a, b) => b.similarity - a.similarity);
  
  // Format chunks in a structured way
  return sortedChunks.map(chunk => {
    return `CLASSIFICATION ENTRY:
Description: ${chunk.content}
Relevance Score: ${chunk.similarity.toFixed(2)}
---`;
  }).join('\n\n');
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

    const modelMapping: { [key: string]: string } = {
      'gpt-4o': 'gpt-4',
      'gpt-4o-mini': 'gpt-4o-mini',
      'gpt-3.5-turbo': 'gpt-3.5-turbo-16k'
    };

    const openAIModel = modelMapping[model] || 'gpt-3.5-turbo-16k';
    console.log(`Using model: ${model} -> ${openAIModel}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

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

    const lastMessage = messages[messages.length - 1].content;
    let relevantContext = '';

    if (agent?.use_knowledge_base) {
      console.log('Knowledge base is enabled, searching for relevant documents...');
      
      try {
        console.log('Generating embedding for query:', lastMessage);
        
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: lastMessage,
          }),
        });

        if (!embeddingResponse.ok) {
          console.error('Embedding response not ok:', await embeddingResponse.text());
          throw new Error('Failed to generate embedding');
        }

        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;

        if (!queryEmbedding) {
          console.error('No embedding generated');
          throw new Error('No embedding generated');
        }

        console.log('Successfully generated embedding, searching chunks...');

        // Increased threshold for better relevance
        const searchThreshold = agent.search_threshold || 0.8;
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
          // Validate and filter chunks
          const validChunks = validateChunks(chunks, searchThreshold);
          console.log(`Found ${validChunks.length} valid chunks out of ${chunks.length} total`);
          
          // Structure the context
          relevantContext = structureContext(validChunks);
          console.log('Structured context:', relevantContext);
        } else {
          console.log('No relevant chunks found');
        }
      } catch (error) {
        console.error('Error in knowledge base search:', error);
      }
    }

    // Improved system messages with explicit instructions
    const systemMessages = [];
    
    // Base system prompt
    const basePrompt = agent?.system_prompt || 'You are a classification assistant that can ONLY use information from the provided context.';
    systemMessages.push({ 
      role: 'system', 
      content: basePrompt 
    });

    // Context injection with explicit instructions
    if (relevantContext) {
      systemMessages.push({ 
        role: 'system', 
        content: `IMPORTANT: You are RESTRICTED to ONLY use the classifications from the context below. If you cannot find an EXACT match, respond with "No matching classification found."\n\nAVAILABLE CLASSIFICATIONS:\n${relevantContext}` 
      });
    }

    console.log('Making completion request with model:', openAIModel);

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: [...systemMessages, ...messages],
        temperature: agent?.temperature || 0.7,
        max_tokens: agent?.max_tokens || 4000,
      }),
    });

    if (!completionResponse.ok) {
      const error = await completionResponse.json();
      console.error('OpenAI Completion Error:', error);
      throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await completionResponse.json();
    console.log('Completion received successfully');

    // Log the interaction for analysis
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