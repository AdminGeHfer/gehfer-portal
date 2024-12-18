import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.77.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting chat completion request');
    
    const {
      messages,
      model,
      systemPrompt,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
      searchThreshold = 0.5 // More permissive default threshold
    } = await req.json();

    console.log('Request configuration:', {
      model,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
      searchThreshold,
      messageCount: messages?.length
    });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    let relevantContext = '';
    let metaKnowledge = '';
    
    if (useKnowledgeBase) {
      console.log('Knowledge base enabled, retrieving relevant documents...');
      
      const lastMessage = messages[messages.length - 1];
      
      try {
        // Generate embedding for query
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: lastMessage.content,
        });
        
        if (!embeddingResponse.data[0].embedding) {
          throw new Error('Failed to generate embedding');
        }

        const embedding = embeddingResponse.data[0].embedding;

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase configuration');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Search for relevant documents with more permissive threshold
        console.log('Searching for relevant documents with threshold:', searchThreshold);
        
        const { data: documents, error: searchError } = await supabase.rpc(
          'match_documents',
          {
            query_embedding: embedding,
            match_threshold: searchThreshold,
            match_count: 8 // Increased from 5
          }
        );

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }

        if (documents && documents.length > 0) {
          console.log(`Found ${documents.length} relevant documents`);
          
          // Process and structure documents by relevance
          const processedDocs = documents
            .sort((a, b) => b.similarity - a.similarity)
            .map((doc, index) => ({
              ...doc,
              relevanceScore: doc.similarity,
              order: index + 1
            }));

          // Structure context with metadata
          relevantContext = processedDocs
            .map(doc => `[Documento ${doc.order} - Relevância: ${(doc.relevanceScore * 100).toFixed(1)}%]:\n${doc.content}`)
            .join('\n\n');
            
          // Generate meta-knowledge about the search results
          metaKnowledge = `
Informações sobre a busca:
- Total de documentos encontrados: ${documents.length}
- Melhor score de relevância: ${(Math.max(...documents.map(d => d.similarity)) * 100).toFixed(1)}%
- Score médio de relevância: ${(documents.reduce((acc, doc) => acc + doc.similarity, 0) / documents.length * 100).toFixed(1)}%
`;
          
          console.log('Meta-knowledge generated:', metaKnowledge);
          console.log('Context preview:', relevantContext.substring(0, 200) + '...');
        } else {
          console.log('No relevant documents found');
          metaKnowledge = 'Nenhum documento relevante encontrado na base de conhecimento.';
        }
      } catch (error) {
        console.error('Error in knowledge base retrieval:', error);
        throw error;
      }
    }

    // Build messages array with context and meta-knowledge
    const finalMessages = [
      {
        role: 'system',
        content: systemPrompt || "You are a helpful AI assistant."
      }
    ];

    // Add meta-knowledge if available
    if (metaKnowledge) {
      finalMessages.push({
        role: 'system',
        content: `Meta-conhecimento sobre a busca:\n${metaKnowledge}`
      });
    }

    // Add context if available
    if (relevantContext) {
      finalMessages.push({
        role: 'system',
        content: `Contexto relevante da base de conhecimento:\n\n${relevantContext}\n\nUse estas informações para informar suas respostas quando relevante.`
      });
    }

    // Add user messages
    finalMessages.push(...messages);

    console.log('Sending request to OpenAI with config:', {
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      temperature,
      maxTokens,
      topP,
      hasContext: !!relevantContext,
      hasMetaKnowledge: !!metaKnowledge,
      messageCount: finalMessages.length
    });

    // Generate response with context
    const completion = await openai.chat.completions.create({
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: finalMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    console.log('Received response from OpenAI');

    // Log completion for analysis
    const { data: logResult } = await supabase
      .from('ai_agent_logs')
      .insert({
        agent_id: agentId,
        event_type: 'completion',
        configuration: {
          model,
          temperature,
          maxTokens,
          topP,
          useKnowledgeBase,
          searchThreshold,
          documentsFound: documents?.length || 0,
          hasContext: !!relevantContext,
          hasMetaKnowledge: !!metaKnowledge
        },
        details: `Generated response with ${finalMessages.length} messages`
      });

    return new Response(
      JSON.stringify(completion),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    );

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    );
  }
});