import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./config.ts";
import type { ChatConfig } from "./config.ts";
import { supabase } from "./supabaseClient.ts";
import { findRelevantDocuments } from "./documentService.ts";
import { generateEmbedding, generateChatCompletion } from "./openaiService.ts";

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
      searchThreshold = 0.5
    }: ChatConfig = await req.json();

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

    // Add system prompt if provided
    if (systemPrompt) {
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Handle knowledge base integration if enabled
    if (useKnowledgeBase && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const embedding = await generateEmbedding(lastMessage.content);
      
      const { documents, metaKnowledge } = await findRelevantDocuments(
        embedding,
        searchThreshold
      );

      if (documents?.length > 0) {
        // Add meta-knowledge about the search
        finalMessages.push({
          role: 'system',
          content: metaKnowledge
        });

        // Add context from relevant documents
        finalMessages.push({
          role: 'system',
          content: `Contexto relevante da base de conhecimento:\n\n${
            documents
              .sort((a, b) => b.similarity - a.similarity)
              .map(doc => doc.content)
              .join('\n\n')
          }\n\nUse estas informações para informar suas respostas quando relevante.`
        });
      }
    }

    // Add user messages
    finalMessages.push(...messages);

    console.log('Sending request to OpenAI with config:', {
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      temperature,
      maxTokens,
      topP,
      messageCount: finalMessages.length
    });

    const completion = await generateChatCompletion(
      finalMessages,
      model,
      temperature,
      maxTokens,
      topP
    );

    // Log completion for analysis
    if (agentId) {
      await supabase
        .from('ai_agent_logs')
        .insert({
          agent_id: agentId,
          event_type: 'completion',
          configuration: {
            model,
            temperature,
            maxTokens,
            topP,
            useKnowledgeBase,
            searchThreshold,
            documentsFound: documents?.length || 0,
            hasContext: !!documents?.length,
            hasMetaKnowledge: true
          },
          details: `Generated response with ${finalMessages.length} messages`
        });
    }

    return new Response(
      JSON.stringify(completion),
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