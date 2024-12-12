import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const groqApiKey = Deno.env.get('GROQ_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_MESSAGES = {
  'gpt-4o-mini': 8,
  'gpt-4o': 12,
  'groq-mixtral': 10,
  'groq-llama': 10,
};

async function searchKnowledgeBase(query: string, moduleId: string | null = null) {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAIApiKey,
  });

  const queryEmbedding = await embeddings.embedQuery(query);

  let matchDocumentsQuery = supabase
    .rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_count: 5,
    });

  if (moduleId) {
    matchDocumentsQuery = matchDocumentsQuery.filter('metadata->moduleId', 'eq', moduleId);
  }

  const { data: documents, error } = await matchDocumentsQuery;

  if (error) {
    throw error;
  }

  return documents;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = 'gpt-4o-mini', moduleId = null } = await req.json();
    console.log('Processing chat completion request:', { messageCount: messages.length, model, moduleId });

    // Get relevant context from knowledge base
    const lastMessage = messages[messages.length - 1];
    let contextualPrompt = '';
    
    if (moduleId) {
      try {
        const relevantDocs = await searchKnowledgeBase(lastMessage.content, moduleId);
        if (relevantDocs && relevantDocs.length > 0) {
          contextualPrompt = `Relevant information from knowledge base:\n${
            relevantDocs.map(doc => doc.content).join('\n\n')
          }\n\nPlease use this information to help answer the question if relevant.`;
        }
      } catch (error) {
        console.error('Error searching knowledge base:', error);
      }
    }

    // Truncate messages based on model
    const limit = MAX_MESSAGES[model as keyof typeof MAX_MESSAGES] || 8;
    const truncatedMessages = messages.slice(-limit);
    console.log(`Truncated messages from ${messages.length} to ${truncatedMessages.length}`);

    if (model.startsWith('groq-')) {
      if (!groqApiKey) {
        throw new Error('Groq API key not configured');
      }

      console.log('Using Groq model for chat completion');
      
      const groqModel = model === 'groq-mixtral' ? 'mixtral-8x7b-32768' : 'llama-3.3-70b-versatile';
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            { 
              role: 'system', 
              content: 'Você é um assistente da GeHfer, seu objetivo é ajudar todos os colaboradores a ser mais eficientes e resolver seus problemas. Seja sempre prestativo e profissional.' 
            },
            ...(contextualPrompt ? [{ role: 'system', content: contextualPrompt }] : []),
            ...truncatedMessages
          ],
          temperature: 0.7,
          max_tokens: model === 'groq-mixtral' ? 32768 : 8192,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Groq API error:', error);
        throw new Error(`Groq API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Using OpenAI model for chat completion');
      
      const openAIModel = model === 'gpt-4o-mini' ? 'gpt-3.5-turbo' : 'gpt-4';
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: openAIModel,
          messages: [
            { 
              role: 'system', 
              content: 'Você é um assistente da GeHfer, seu objetivo é ajudar todos os colaboradores a ser mais eficientes e resolver seus problemas. Seja sempre prestativo e profissional.' 
            },
            ...(contextualPrompt ? [{ role: 'system', content: contextualPrompt }] : []),
            ...truncatedMessages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});