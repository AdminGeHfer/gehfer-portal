import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RNCWithRelations } from '@/types/rnc'
import { toast } from 'sonner'

export const useRNCList = () => {
  const [rncs, setRNCs] = useState<RNCWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRNCs = async () => {
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
          workflow_transitions:rnc_workflow_transitions(*),
          created_by_profile:profiles!created_by(name),
          assigned_by_profile:profiles!assigned_by(name),
          assigned_to_profile:profiles!assigned_to(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRNCs(data as RNCWithRelations[])
    } catch (err) {
      toast.error('Error fetching RNCs')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRNCs()
  }, [])

  return { rncs, loading, refetch: fetchRNCs }
}
