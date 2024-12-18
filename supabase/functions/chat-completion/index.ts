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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });
  }

  try {
    console.log('Received request to chat-completion function');
    
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    const {
      messages,
      model,
      systemPrompt,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId
    } = await req.json();

    console.log('Request payload:', {
      model,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
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
    
    if (useKnowledgeBase) {
      console.log('Retrieving relevant documents for context...');
      
      const lastMessage = messages[messages.length - 1];
      
      try {
        // Gerar embedding da pergunta
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: lastMessage.content,
        });
        
        if (!embeddingResponse.data[0].embedding) {
          throw new Error('Failed to generate embedding');
        }

        const embedding = embeddingResponse.data[0].embedding;

        // Configurar cliente Supabase
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Buscar documentos relevantes
        const { data: documents, error: searchError } = await supabase.rpc(
          'match_documents',
          {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: 5
          }
        );

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }

        if (documents && documents.length > 0) {
          console.log(`Found ${documents.length} relevant documents`);
          
          // Estruturar contexto com documentos relevantes
          relevantContext = documents
            .map((doc, index) => `[Documento ${index + 1}]: ${doc.content}`)
            .join('\n\n');
            
          console.log('Relevant context:', relevantContext.substring(0, 200) + '...');
        }
      } catch (error) {
        console.error('Error in knowledge base retrieval:', error);
        throw error;
      }
    }

    // Construir mensagens com contexto
    const finalMessages = [
      {
        role: 'system',
        content: systemPrompt || "You are a helpful AI assistant."
      },
      ...(relevantContext ? [{
        role: 'system',
        content: `Relevant context from knowledge base:\n\n${relevantContext}\n\nUse this context to inform your responses when relevant.`
      }] : []),
      ...messages
    ];

    console.log('Sending request to OpenAI with config:', {
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      temperature,
      maxTokens,
      topP,
      hasContext: !!relevantContext,
      messageCount: finalMessages.length
    });

    // Gerar resposta com contexto
    const completion = await openai.chat.completions.create({
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: finalMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    console.log('Received response from OpenAI');

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