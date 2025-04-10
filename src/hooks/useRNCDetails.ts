import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RNCWithRelations } from '@/types/rnc';
import { toast } from 'sonner';

export const useRNCDetails = (id: string) => {
  const [rnc, setRNC] = useState<RNCWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const fetchRNC = useCallback(async () => {
    if (!id || !mounted.current) return;

    // Cancel any ongoing request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

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
        .is('deleted_at', null)
        .eq('id', id)
        .maybeSingle();

      if (!mounted.current) return;

      if (fetchError) throw fetchError;

      if (!data) {
        throw new Error('RNC não encontrada');
      }

      setRNC(data as RNCWithRelations);
    } catch (err) {
      if (!mounted.current) return;
      
      // Only set error if not aborted
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error in fetchRNC:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        toast.error('Erro ao carregar detalhes da RNC');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRNC();
    
    return () => {
      if (mounted.current) {
        setRNC(null);
        setError(null);
        setLoading(true);
        if (abortController.current) {
          abortController.current.abort();
        }
      }
    };
  }, [fetchRNC]);

  return { rnc, loading, error, refetch: fetchRNC };
};