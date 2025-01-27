import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useRNCRealtime = (onUpdate: () => void) => {
  useEffect(() => {
    // Subscribe to RNC changes
    const rncChannel = supabase
      .channel('rnc_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rncs'
        },
        (payload) => {
          onUpdate()
          if (payload.eventType === 'UPDATE') {
            toast.info('RNC updated')
          } else if (payload.eventType === 'INSERT') {
            toast.success('New RNC created')
          }
        }
      )
      .subscribe()

    // Subscribe to RNC events
    const eventsChannel = supabase
      .channel('rnc_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rnc_events'
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(rncChannel)
      supabase.removeChannel(eventsChannel)
    }
  }, [onUpdate])
}
