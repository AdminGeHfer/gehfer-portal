/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: ["supabase-integration"]
 * checksum: "f8e7d6c5b4"
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Required environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);