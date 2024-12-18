import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let relevantContext = '';
    
    if (useKnowledgeBase) {
      console.log('Retrieving relevant documents for context...');
      
      // Get the last user message
      const lastMessage = messages[messages.length - 1];
      
      // Generate embedding for the query
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: lastMessage.content,
      });
      
      const embedding = embeddingResponse.data.data[0].embedding;

      // Search for relevant documents
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
    }

    // Prepare messages array with system prompt and context
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
      model,
      temperature,
      maxTokens,
      topP,
      hasContext: !!relevantContext
    });

    const completion = await openai.createChatCompletion({
      model: model === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: finalMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});