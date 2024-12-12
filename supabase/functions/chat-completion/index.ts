import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage, AIMessage } from 'langchain/schema'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, model = 'gpt-4o-mini', agentId, memory } = await req.json()

    const chat = new ChatOpenAI({
      modelName: model,
      temperature: 0.7,
      streaming: false,
    })

    const formattedMessages = messages.map((msg: Message) => {
      switch (msg.role) {
        case 'system':
          return new SystemMessage(msg.content)
        case 'user':
          return new HumanMessage(msg.content)
        case 'assistant':
          return new AIMessage(msg.content)
        default:
          throw new Error(`Unknown message role: ${msg.role}`)
      }
    })

    // Add memory context if available
    if (memory?.history) {
      const memoryContext = `Previous conversation context:\n${memory.history}`
      formattedMessages.unshift(new SystemMessage(memoryContext))
    }

    const response = await chat.call(formattedMessages)

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              role: 'assistant',
              content: response.content,
            },
          },
        ],
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})