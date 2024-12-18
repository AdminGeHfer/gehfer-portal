/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: [
 *   "knowledge-base",
 *   "dynamic-threshold",
 *   "error-handling",
 *   "logging"
 * ]
 * checksum: "1a2b3c4d5e"
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./config.ts";
import { generateEmbedding, generateChatCompletion } from "./openaiService.ts";
import { findRelevantDocuments } from "./documentService.ts";

console.log("Chat completion function started");

serve(async (req) => {
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
      agentId,
      searchThreshold = 0.3
    } = await req.json();

    console.log('Request configuration:', {
      model,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
      searchThreshold,
      messageCount: messages?.length
    });

    const finalMessages = [];

    if (systemPrompt) {
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (useKnowledgeBase && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      console.log('Generating embedding for knowledge base search');
      const embedding = await generateEmbedding(lastMessage.content);
      
      const { documents, metaKnowledge } = await findRelevantDocuments(
        embedding,
        searchThreshold
      );

      if (documents.length > 0) {
        const context = documents
          .sort((a, b) => b.similarity - a.similarity)
          .map(doc => doc.content)
          .join('\n\n');

        finalMessages.push({
          role: 'system',
          content: `Contexto relevante da base de conhecimento:\n\n${context}\n\n${metaKnowledge}\n\nUse estas informações para informar suas respostas quando relevante.`
        });
      }
    }

    finalMessages.push(...messages);

    console.log('Sending request to OpenAI with config:', {
      model,
      temperature,
      maxTokens,
      topP,
      messageCount: finalMessages.length
    });

    const completionData = await generateChatCompletion(
      finalMessages,
      model,
      temperature,
      maxTokens,
      topP
    );

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
    console.error('Error in chat-completion function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
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