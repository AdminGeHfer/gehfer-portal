import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedKey: string | null = null;
let lastCacheTime: number | null = null;

const getOpenAIKey = async (retryCount = 0): Promise<string> => {
  // Check cache first
  if (cachedKey && lastCacheTime && (Date.now() - lastCacheTime < CACHE_DURATION)) {
    console.log('Returning cached OpenAI key');
    return cachedKey;
  }

  try {
    const key = Deno.env.get('OPENAI_API_KEY');
    if (!key) {
      throw new Error('OpenAI API key not configured in environment');
    }

    // Update cache
    cachedKey = key;
    lastCacheTime = Date.now();
    console.log('OpenAI key retrieved and cached successfully');
    
    return key;
  } catch (error) {
    console.error(`Error retrieving OpenAI key (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getOpenAIKey(retryCount + 1);
    }
    
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const key = await getOpenAIKey();
    
    return new Response(
      JSON.stringify({ key }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': `max-age=${CACHE_DURATION / 1000}` 
        } 
      }
    );
  } catch (error) {
    console.error('Error in get-openai-key function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve OpenAI key',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});