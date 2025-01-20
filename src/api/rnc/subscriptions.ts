import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";
import { getRNCById } from "./queries";

export const subscribeToRNCChanges = (id: string, onUpdate: (rnc: RNC) => void) => {
  const subscription = supabase
    .channel(`rnc_${id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rncs',
        filter: `id=eq.${id}`
      },
      async (payload) => {
        if (payload.new) {
          const updatedRNC = await getRNCById(id);
          if (updatedRNC) {
            onUpdate(updatedRNC);
          }
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};