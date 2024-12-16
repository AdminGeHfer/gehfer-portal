import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; 
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'; 

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Lidar com requisições CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Obter a chave da API diretamente do ambiente
        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAIApiKey) {
            console.error('OpenAI API key not configured');
            throw new Error('OpenAI API key not configured. Please ensure it is set in Edge Function Secrets Management.');
        }

        // Log para verificações (cuidado para não expor dados sensíveis)
        console.log('API Key format check:', {
            startsWithSk: openAIApiKey.startsWith('sk-'),
            length: openAIApiKey.length,
            firstChars: openAIApiKey.substring(0, 5) + '...'
        });

        // Processar a requisição
        const { messages, model, agentId, memory } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Invalid messages format');
        }
        console.log('Processing request with:', { model, agentId });

        // Inicializar cliente Supabase
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Obter configuração do agente
        const { data: agent, error: agentError } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', agentId)
            .single();
        
        if (agentError) {
            console.error('Error fetching agent:', agentError);
            throw agentError;
        }
        console.log('Agent configuration:', agent);

        // Mapear modelos para a API OpenAI
        const modelMap = {
            'gpt-4o-mini': 'gpt-4',
            'gpt-4o': 'gpt-4-turbo-preview'
        };
        const actualModel = modelMap[model] || 'gpt-4';
        console.log(`Using OpenAI model: ${actualModel}`);

        // Chamada à API OpenAI
        const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: actualModel,
                messages: [
                    { role: 'system', content: agent.system_prompt || 'You are a helpful assistant.' },
                    ...messages
                ],
                temperature: agent.temperature || 0.7,
                max_tokens: agent.max_tokens || 4000,
            }),
        });

        // Verificar a resposta da OpenAI
        if (!completionResponse.ok) {
            const error = await completionResponse.json();
            console.error('OpenAI Completion Error:', error);
            throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
        }

        const completion = await completionResponse.json();

        // Log da interação
        await supabase.rpc('log_agent_event', {
            p_agent_id: agentId,
            p_conversation_id: memory?.conversationId,
            p_event_type: 'completion',
            p_configuration: {
                model,
                temperature: agent.temperature,
                max_tokens: agent.max_tokens
            },
            p_details: `Response: ${completion.choices[0].message?.content}`
        });

        // Retornar a resposta
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
