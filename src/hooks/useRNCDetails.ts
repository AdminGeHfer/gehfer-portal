import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RNCWithRelations } from '@/types/rnc';
import { toast } from 'sonner';

export const useRNCDetails = (id: string) => {
  const [rnc, setRNC] = useState<RNCWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRNC = useCallback(async () => {
    if (!id) {
      setError('ID da RNC não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('rncs')
        .select(`
          *,
          attachments:rnc_attachments(*),
          contacts:rnc_contacts(*),
          events:rnc_events(
            *,
            created_by_profile:profiles(name)
          ),
          products:rnc_products(*),
          workflow_transitions:rnc_workflow_transitions(
            *,
            created_by_profile:profiles(name)
          ),
          created_by_profile:profiles!created_by(name),
          assigned_by_profile:profiles!assigned_by(name),
          assigned_to_profile:profiles!assigned_to(name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching RNC:', fetchError);
        setError(fetchError.message);
        toast.error('Erro ao carregar detalhes da RNC');
        return;
      }

      if (!data) {
        setError('RNC não encontrada');
        toast.error('RNC não encontrada');
        return;
      }

      setRNC(data as RNCWithRelations);
    } catch (err) {
      console.error('Error in fetchRNC:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar detalhes da RNC');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRNC();
    
    return () => {
      setRNC(null);
      setError(null);
      setLoading(true);
    };
  }, [fetchRNC]);

  return { rnc, loading, error, refetch: fetchRNC };
};