import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseBufferMemory } from '@/lib/langchain/memory/supabaseMemory';

export const useMemory = (conversationId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const initializeMemory = useCallback(async () => {
    return new SupabaseBufferMemory({ conversationId });
  }, [conversationId]);

  const clearMemory = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase
        .from('ai_memory_buffers')
        .delete()
        .eq('conversation_id', conversationId);
    } catch (error) {
      console.error('Error clearing memory:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return {
    initializeMemory,
    clearMemory,
    isLoading
  };
};