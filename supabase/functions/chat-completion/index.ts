import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.77.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const configuration = new Configuration({
      apiKey: openAIApiKey,
    });

    const openai = new OpenAIApi(configuration);

    let relevantContext = '';
    
    if (useKnowledgeBase) {
      console.log('Retrieving relevant documents for context...');
      
      const lastMessage = messages[messages.length - 1];
      
      try {
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: lastMessage.content,
        });
        
        if (!embeddingResponse.data.data[0].embedding) {
          throw new Error('Failed to generate embedding');
        }

        const embedding = embeddingResponse.data.data[0].embedding;

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

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
        } else if (documents && documents.length > 0) {
          console.log(`Found ${documents.length} relevant documents`);
          relevantContext = documents
            .map(doc => doc.content)
            .join('\n\n');
        }
      } catch (error) {
        console.error('Error in knowledge base retrieval:', error);
      }
    }

    const finalMessages = [
      {
        role: 'system',
        content: systemPrompt || "You are a helpful AI assistant."
      },
      ...(relevantContext ? [{
        role: 'system',
        content: `Relevant context from knowledge base:\n\n${relevantContext}`
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

    const completion = await openai.createChatCompletion({
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: finalMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    console.log('Received response from OpenAI');

    return new Response(
      JSON.stringify(completion.data),
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