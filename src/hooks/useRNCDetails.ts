import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RNCWithRelations } from '@/types/rnc'
import { toast } from 'sonner'

export const useRNCDetails = (id: string) => {
  const [rnc, setRNC] = useState<RNCWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRNC = async () => {
    try {
      const { data, error } = await supabase
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
          workflow_transitions:rnc_workflow_transitions(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      setRNC(data as RNCWithRelations)
    } catch (err) {
      toast.error('Error fetching RNC details')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchRNC()
    }
  }, [id])

  return { rnc, loading, refetch: fetchRNC }
}
