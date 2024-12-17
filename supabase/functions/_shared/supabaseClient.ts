import { createClient } from '@supabase/supabase-js';

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