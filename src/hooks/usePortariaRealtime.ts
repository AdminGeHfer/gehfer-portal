import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePortariaRealtime() {
  useEffect(() => {
    const channel = supabase
      .channel('portaria_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'truck_access_logs'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            toast.info('Registro de acesso atualizado');
          } else if (payload.eventType === 'INSERT') {
            toast.info('Novo registro de acesso');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}