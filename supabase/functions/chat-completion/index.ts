import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      messages, 
      model, 
      systemPrompt, 
      useKnowledgeBase, 
      temperature = 0.7,
      maxTokens = 1000,
      topP = 1,
      searchThreshold = 0.4,
      agentId 
    } = await req.json();

    console.log('Request received:', {
      messageCount: messages.length,
      model,
      useKnowledgeBase,
      agentId
    });

    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openAiApiKey });
    const openai = new OpenAIApi(configuration);
    
    let contextualMessages = [...messages];

    if (useKnowledgeBase && agentId) {
      try {
        console.log('Knowledge base enabled, searching for relevant documents');
        
        const lastUserMessage = messages[messages.length - 1].content;
        
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-3-small",
          input: lastUserMessage,
        });

        if (!embeddingResponse.data?.data?.[0]?.embedding) {
          throw new Error('Failed to generate embedding');
        }

        const embedding = embeddingResponse.data.data[0].embedding;

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log('Searching documents with parameters:', {
          threshold: searchThreshold,
          agentId
        });

        const { data: documents, error: searchError } = await supabase.rpc(
          'match_documents',
          {
            query_embedding: embedding,
            match_threshold: searchThreshold,
            match_count: 5,
            p_agent_id: agentId
          }
        );

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }

        console.log('Search results:', {
          documentsFound: documents?.length || 0,
          similarityScores: documents?.map(d => d.similarity)
        });

        if (documents && documents.length > 0) {
          const context = documents
            .map(doc => doc.content)
            .join('\n\n');

          contextualMessages.unshift({
            role: 'system',
            content: `Context from knowledge base:\n${context}\n\n${systemPrompt || ''}`
          });
        } else {
          console.log('No relevant documents found');
          if (systemPrompt) {
            contextualMessages.unshift({
              role: 'system',
              content: systemPrompt
            });
          }
        }
      } catch (error) {
        console.error('Error in document search:', error);
        if (systemPrompt) {
          contextualMessages.unshift({
            role: 'system',
            content: systemPrompt
          });
        }
      }
    } else if (systemPrompt) {
      contextualMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    console.log('Sending completion request with message count:', contextualMessages.length);

    const completion = await openai.createChatCompletion({
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      messages: contextualMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    if (!completion.data?.choices?.[0]?.message) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});