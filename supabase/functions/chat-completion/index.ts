import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

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
        // Get OpenAI API key from environment
        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAIApiKey) {
            console.error('OpenAI API key not configured');
            throw new Error('OpenAI API key not configured');
        }

        // Initialize OpenAI
        const openai = new OpenAIApi(new Configuration({ apiKey: openAIApiKey }));

        // Process request
        const { messages, model, agentId } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Invalid messages format');
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get agent configuration
        const { data: agent, error: agentError } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', agentId)
            .single();
        
        if (agentError) {
            console.error('Error fetching agent:', agentError);
            throw agentError;
        }

        // Get the last user message
        const lastMessage = messages[messages.length - 1].content;

        // Search relevant documents if knowledge base is enabled
        let relevantContext = '';
        if (agent.use_knowledge_base) {
            console.log('Knowledge base is enabled, searching for relevant documents...');
            
            try {
                // Generate embedding for the query
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

                // Search for relevant documents
                const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
                    query_embedding: queryEmbedding,
                    match_threshold: agent.search_threshold || 0.7,
                    match_count: 5
                });

                if (searchError) {
                    console.error('Error searching documents:', searchError);
                    throw searchError;
                }

                if (documents && documents.length > 0) {
                    console.log(`Found ${documents.length} relevant documents`);
                    relevantContext = `Relevant information from knowledge base:\n${documents.map(doc => doc.content).join('\n\n')}`;
                    console.log('Context added:', relevantContext);
                } else {
                    console.log('No relevant documents found');
                }
            } catch (error) {
                console.error('Error in knowledge base search:', error);
                // Log the full error for debugging
                console.error('Full error:', JSON.stringify(error, null, 2));
            }
        }

        // Map models
        const modelMap: Record<string, string> = {
            'gpt-4o-mini': 'gpt-4',
            'gpt-4o': 'gpt-4-turbo-preview'
        };
        const actualModel = modelMap[model] || 'gpt-4';

        console.log(`Using OpenAI model: ${actualModel}`);
        console.log('Relevant context length:', relevantContext.length);

        // Call OpenAI API with timeout
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
                model: actualModel,
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

        // Log the interaction
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