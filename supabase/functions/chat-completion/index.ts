// Importando o servidor do Deno e o cliente Supabase
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; 
import { createClient } from "https://cdn.supabase.com/js/supabase-js"; // Importando a função para criar cliente Supabase
import { validateChunkRelevance, structureChunkContent } from '../_shared/matchDocuments.ts'; 

// Variáveis de ambiente para Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey); // Inicializando o cliente Supabase

// Configurações de CORS
const corsHeaders = { 
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 
}; 

// Função para validar chunks com base em um limite de similaridade
const validateChunks = (chunks: any[], threshold: number = 0.8) => { 
  return chunks.filter(chunk => { 
    if (!validateChunkRelevance(chunk.similarity, threshold)) { 
      console.log(`Chunk filtered out due to low similarity: ${chunk.similarity}`); 
      return false; 
    } 
    return true; 
  }); 
};

// Servidor Deno que responde a requisições
serve(async (req) => { 
  // Responde a pré-requisições CORS
  if (req.method === 'OPTIONS') { 
    return new Response(null, { headers: corsHeaders }); 
  } 

  try { 
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY'); 
    if (!openAIApiKey) { 
      console.error('OpenAI API key not configured'); 
      throw new Error('OpenAI API key not configured'); 
    } 

    // Obtendo dados da requisição JSON
    const { messages, model, agentId } = await req.json(); 
    console.log('Received request:', { model, agentId, messageCount: messages?.length });

    let relevantContext = '';
    const agent = { use_knowledge_base: true }; // Exemplo em que o agente faz uso da base de conhecimento

    // Se o agente estiver configurado para usar a base de conhecimento
    if (agent?.use_knowledge_base) { 
      try { 
        // Aqui você deve gerar o embedding do texto da requisição
        const queryEmbedding = []; // Implementação do seu mecanismo de embedding deve ir aqui.

        // Para busca in Supabase
        const searchThreshold = 0.8; // Limite de similaridade
        console.log('Search threshold:', searchThreshold);

        // Chamando a função RPC match_document_chunks no Supabase
        const { data: chunks, error: searchError } = await supabase.rpc('match_document_chunks', { query_embedding: queryEmbedding, match_threshold: searchThreshold, match_count: 5 });
        
        if (searchError) { 
          console.error('Error searching chunks:', searchError); 
          throw searchError; 
        }
        
        if (chunks && chunks.length > 0) { 
          // Validando e filtrando chunks
          const validChunks = validateChunks(chunks, searchThreshold);
          console.log(`Found ${validChunks.length} valid chunks out of ${chunks.length} total`); 

          // Estruturando o contexto utilizando informações válidas
          relevantContext = structureChunkContent(validChunks); 
          console.log('Structured context:', relevantContext); 
        } else { 
          console.log('No relevant chunks found'); 
        } 
      } catch (error) { 
        console.error('Error in knowledge base search:', error); 
      } 
    } 

    // Mensagens do sistema com instruções explícitas
    const systemMessages = [];
    const systemPrompt = agent?.system_prompt || defaultSystemPrompt;

    
    systemMessages.push({ role: 'system', content: basePrompt });

    // Injetando contexto relevante apenas se existir
    if (relevantContext) { 
      systemMessages.push({ role: 'system', content: `IMPORTANTE: Use APENAS as classificações abaixo, mantendo formato EXATO:\n\n${relevantContext}` }); 
    } 

    // Implementação para enviar a requisição de completions com o OpenAI API deve ir aqui
    // const completion = await openAIClient.createCompletion(messages, model, systemMessages);

    // Retornando a resposta
    return new Response(JSON.stringify(completion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }); 

  } catch (error: any) { 
    console.error('Error in chat-completion function:', error); 
    return new Response( 
      JSON.stringify({ error: error.message || 'An unknown error occurred', details: error.stack || 'No stack trace available' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    ); 
  } 
});
