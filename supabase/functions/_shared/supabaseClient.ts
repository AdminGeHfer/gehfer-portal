import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.8';

export const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
      auth: {
        persistSession: false
      }
    }
  );
};