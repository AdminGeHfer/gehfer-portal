import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, agentId, memory } = await req.json();

    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    // Get agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) throw agentError;

    console.log('Agent configuration:', agent);

    // Generate embedding for the last user message
    const lastUserMessage = messages[messages.length - 1].content;
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: lastUserMessage,
    });

    const queryEmbedding = embeddingResponse.data.data[0].embedding;

    // Search for relevant chunks
    const { data: relevantChunks, error: searchError } = await supabase
      .rpc('match_document_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: agent.search_threshold || 0.7,
        match_count: 5
      });

    if (searchError) throw searchError;

    console.log(`Found ${relevantChunks?.length || 0} relevant chunks`);

    // Prepare context from chunks
    let contextText = '';
    if (relevantChunks && relevantChunks.length > 0) {
      contextText = 'Relevant context:\n' + relevantChunks
        .map(chunk => chunk.content)
        .join('\n---\n');
    }

    // Prepare system message
    const systemMessage = {
      role: 'system',
      content: `${agent.system_prompt || 'You are a helpful assistant.'}\n\n${contextText}`
    };

    // Combine messages
    const fullMessages = [systemMessage, ...messages];

    // Get completion from OpenAI
    const completion = await openai.createChatCompletion({
      model: model || 'gpt-4o-mini',
      messages: fullMessages,
      temperature: agent.temperature || 0.7,
      max_tokens: agent.max_tokens || 4000,
    });

    // Log the interaction
    await supabase.rpc('log_agent_event', {
      p_agent_id: agentId,
      p_conversation_id: memory?.conversationId,
      p_event_type: 'completion',
      p_configuration: {
        model,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens,
        chunks_found: relevantChunks?.length || 0
      },
      p_details: `Query: ${lastUserMessage}\nResponse: ${completion.data.choices[0].message?.content}`
    });

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});