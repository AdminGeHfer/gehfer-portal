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
          events:rnc_events(
            *,
            created_by_profile:profiles(name)
          ),
          contacts:rnc_contacts(*),
          products:rnc_products(*),
          attachments:rnc_attachments(*),
          workflow_transitions:rnc_workflow_transitions(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRNCs(data)
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
