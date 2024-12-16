import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
            throw new Error('OpenAI API key not configured');
        }

        const { messages, model, agentId } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Invalid messages format');
        }

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

        const lastMessage = messages[messages.length - 1].content;

        let relevantContext = '';
        if (agent.use_knowledge_base) {
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
                    throw new Error('Failed to generate embedding: ' + await embeddingResponse.text());
                }

                const embeddingData = await embeddingResponse.json();
                const queryEmbedding = embeddingData.data[0].embedding;

                if (!queryEmbedding) {
                    throw new Error('No embedding generated');
                }

                console.log('Successfully generated embedding, searching documents...');
                console.log('Search threshold:', agent.search_threshold);

                const { data: availableDocs, error: docsError } = await supabase
                    .from('ai_agent_documents')
                    .select('document_id')
                    .eq('agent_id', agentId);

                if (docsError) {
                    throw new Error('Error fetching available documents: ' + docsError.message);
                }

                console.log('Available documents:', availableDocs?.length || 0);

                const searchThreshold = agent.search_threshold || 0.5;
                
                const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
                    query_embedding: queryEmbedding,
                    match_threshold: searchThreshold,
                    match_count: 5
                });

                if (searchError) {
                    console.error('Error searching documents:', searchError);
                    throw searchError;
                }

                if (documents && documents.length > 0) {
                    console.log(`Found ${documents.length} relevant documents with similarity scores:`);
                    documents.forEach((doc, i) => {
                        console.log(`Doc ${i + 1} similarity: ${doc.similarity}`);
                    });
                    
                    relevantContext = `Relevant information from knowledge base:\n${documents.map(doc => doc.content).join('\n\n')}`;
                    console.log('Context added with length:', relevantContext.length);
                } else {
                    console.log('No relevant documents found with threshold:', searchThreshold);
                    
                    const { data: documentsRetry, error: retryError } = await supabase.rpc('match_documents', {
                        query_embedding: queryEmbedding,
                        match_threshold: 0.3,
                        match_count: 3
                    });

                    if (documentsRetry && documentsRetry.length > 0) {
                        console.log(`Found ${documentsRetry.length} documents with lower threshold`);
                        relevantContext = `Relevant information from knowledge base:\n${documentsRetry.map(doc => doc.content).join('\n\n')}`;
                        console.log('Context added with length:', relevantContext.length);
                    } else {
                        console.log('No relevant documents found');
                    }
                }
            } catch (error) {
                console.error('Error in knowledge base search:', error);
                console.error('Full error:', JSON.stringify(error, null, 2));
            }
        }

        // Usando o modelo exatamente como recebido, sem mapeamento
        console.log(`Using OpenAI model: ${model}`);
        console.log('Relevant context length:', relevantContext.length);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: agent.system_prompt || 'You are a helpful assistant.' },
                    ...(relevantContext ? [{ role: 'system', content: relevantContext }] : []),
                    ...messages
                ],
                temperature: agent.temperature || 0.7,
                max_tokens: agent.max_tokens || 4000,
            }),
        });

        clearTimeout(timeout);

        if (!completionResponse.ok) {
            const error = await completionResponse.json();
            console.error('OpenAI Completion Error:', error);
            throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
        }

        const completion = await completionResponse.json();

        await supabase.rpc('log_agent_event', {
            p_agent_id: agentId,
            p_event_type: 'completion',
            p_configuration: {
                model,
                temperature: agent.temperature,
                max_tokens: agent.max_tokens,
                knowledge_base_used: agent.use_knowledge_base,
                documents_found: relevantContext ? 'yes' : 'no'
            },
            p_details: `Response: ${completion.choices[0].message?.content}`
        });

        return new Response(JSON.stringify(completion), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error in chat-completion function:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});