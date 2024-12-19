import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateEmbedding, generateChatCompletion } from "./openaiService.ts";
import { findRelevantDocuments } from "./documentService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    const {
      messages,
      model,
      systemPrompt,
      useKnowledgeBase,
      temperature = 0.7,
      maxTokens = 1000,
      topP = 1,
      agentId,
      searchThreshold = 0.4
    } = await req.json();

    console.log('Chat completion request received:', {
      requestId,
      messageCount: messages?.length,
      model,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
      searchThreshold
    });

    const finalMessages = [];

    if (systemPrompt) {
      console.log('Adding system prompt:', systemPrompt);
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (useKnowledgeBase && messages.length > 0) {
      const contextMessages = messages.slice(-3);
      const contextText = contextMessages
        .map(msg => msg.content)
        .join("\n");
      
      console.log('Processing knowledge base for context:', {
        requestId,
        contextLength: contextText.length
      });
      
      console.log('Generating embedding...');
      const embedding = await generateEmbedding(contextText);
      console.log('Embedding generated:', {
        requestId,
        dimensions: embedding.length,
        sample: embedding.slice(0, 5)
      });
      
      console.log('Searching relevant documents with threshold:', searchThreshold);
      const { documents, metaKnowledge } = await findRelevantDocuments(
        embedding,
        searchThreshold
      );
      
      console.log('Search results:', {
        requestId,
        documentsFound: documents.length,
        metaKnowledge,
        similarityScores: documents.map(d => d.similarity)
      });

      if (documents.length > 0) {
        const context = documents
          .sort((a, b) => b.similarity - a.similarity)
          .map(doc => doc.content)
          .join('\n\n');

        console.log('Context prepared:', {
          requestId,
          contextLength: context.length,
          documentCount: documents.length,
          firstDocumentScore: documents[0]?.similarity
        });

        finalMessages.push({
          role: 'system',
          content: `Contexto relevante da base de conhecimento:\n\n${context}\n\n${metaKnowledge}\n\nUse estas informações para informar suas respostas quando relevante.`
        });
      } else {
        console.log('No relevant documents found', { requestId });
      }
    }

    finalMessages.push(...messages);

    console.log('Preparing chat completion with:', {
      requestId,
      finalMessageCount: finalMessages.length,
      model,
      temperature,
      maxTokens,
      topP
    });

    const completionData = await generateChatCompletion(
      finalMessages,
      model,
      temperature,
      maxTokens,
      topP
    );

    const totalTime = Date.now() - startTime;

    console.log('Chat completion successful:', {
      requestId,
      responseTokens: completionData.usage?.total_tokens,
      choicesCount: completionData.choices?.length,
      totalTimeMs: totalTime
    });

    return new Response(
      JSON.stringify(completionData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    );

  } catch (error) {
    console.error('Error in chat-completion function:', {
      requestId,
      error: error.message,
      stack: error.stack,
      totalTimeMs: Date.now() - startTime
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        requestId
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    );
  }
});