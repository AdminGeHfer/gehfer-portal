import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/ai';

export const useMemory = (conversationId: string) => {
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeMemory = useCallback(async () => {
    if (!conversationId || isInitializing) return null;
    
    setIsInitializing(true);
    try {
      console.log('Initializing memory for conversation:', conversationId);
      
      const { data: existingBuffer, error: bufferError } = await supabase
        .from('ai_memory_buffers')
        .select('*')
        .eq('conversation_id', conversationId)
        .single();

      if (bufferError && bufferError.code !== 'PGRST116') {
        console.error('Error fetching memory buffer:', bufferError);
        throw bufferError;
      }

      if (!existingBuffer) {
        const { error: createError } = await supabase
          .from('ai_memory_buffers')
          .insert({
            conversation_id: conversationId,
            content: '',
            type: 'summary',
          });

        if (createError) {
          console.error('Error creating memory buffer:', createError);
          throw createError;
        }
      }

      return existingBuffer;
    } catch (error) {
      console.error('Error in memory initialization:', error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [conversationId]);

  const updateMemory = useCallback(async (messages: Message[]) => {
    if (!conversationId || messages.length === 0) return;

    try {
      const summary = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const { error } = await supabase
        .from('ai_memory_buffers')
        .update({ 
          content: summary,
          updated_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId);

      if (error) {
        console.error('Error updating memory:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in memory update:', error);
      throw error;
    }
  }, [conversationId]);

  return {
    initializeMemory,
    updateMemory,
    isInitializing
  };
};