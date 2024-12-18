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

    console.log('Chat completion request received:', {
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
      const lastMessage = messages[messages.length - 1];
      console.log('Processing knowledge base for message:', lastMessage.content);
      
      console.log('Generating embedding...');
      const embedding = await generateEmbedding(lastMessage.content);
      console.log('Embedding generated:', {
        dimensions: embedding.length,
        sample: embedding.slice(0, 5)
      });
      
      console.log('Searching relevant documents with threshold:', searchThreshold);
      const { documents, metaKnowledge } = await findRelevantDocuments(
        embedding,
        searchThreshold
      );
      
      console.log('Search results:', {
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
          contextLength: context.length,
          documentCount: documents.length,
          firstDocumentScore: documents[0]?.similarity
        });

        finalMessages.push({
          role: 'system',
          content: `Contexto relevante da base de conhecimento:\n\n${context}\n\n${metaKnowledge}\n\nUse estas informações para informar suas respostas quando relevante.`
        });
      } else {
        console.log('No relevant documents found');
      }
    }

    finalMessages.push(...messages);

    console.log('Preparing chat completion with:', {
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

    console.log('Chat completion successful:', {
      responseTokens: completionData.usage?.total_tokens,
      choicesCount: completionData.choices?.length
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
    console.error('Error in chat-completion function:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
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