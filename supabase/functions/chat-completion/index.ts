import "https://deno.land/x/xhr@0.1.0/mod.ts"; 
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; 
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'; 

const openAIApiKey = Deno.env.get('OPENAI_API_KEY'); 
const supabaseUrl = Deno.env.get('SUPABASE_URL'); 
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Only allow valid OpenAI models
const MODEL_MAPPING: Record<string, string> = {
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-4o': 'gpt-4o'
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { messages, agentId } = await req.json();

        // Input validation
        if (!Array.isArray(messages) || messages.length === 0 || !agentId) {
            return new Response(
                JSON.stringify({ error: 'Invalid input data' }),
                { status: 400, headers: corsHeaders }
            );
        }

        // Get agent configuration
        const { data: agentConfig, error: agentError } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agentError || !agentConfig) {
            console.error('Error fetching agent config:', agentError);
            return new Response(
                JSON.stringify({ error: 'Agent not found' }),
                { status: 404, headers: corsHeaders }
            );
        }

        // Model validation
        const modelId = MODEL_MAPPING[agentConfig.model_id];
        if (!modelId) {
            console.error(`Invalid model ID: ${agentConfig.model_id}`);
            return new Response(
                JSON.stringify({ 
                    error: `Invalid model ID: ${agentConfig.model_id}`,
                    validModels: Object.keys(MODEL_MAPPING)
                }),
                { status: 400, headers: corsHeaders }
            );
        }

        // Prepare system message
        const systemMessage = {
            role: 'system',
            content: agentConfig.system_prompt || 'You are a helpful assistant.'
        };

        console.log('Making request to OpenAI with model:', modelId);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelId,
                messages: [systemMessage, ...messages],
                temperature: agentConfig.temperature,
                max_tokens: agentConfig.max_tokens,
                top_p: agentConfig.top_p,
                stop: agentConfig.stop_sequences,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            throw new Error('OpenAI API error');
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        console.error('Error in chat-completion function:', error);
        return new Response(
            JSON.stringify({ error: error.message, details: error.toString() }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});