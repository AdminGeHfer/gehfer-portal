import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Required environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);