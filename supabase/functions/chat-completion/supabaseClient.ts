/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: ["supabase-integration"]
 * checksum: "f8e7d6c5b4"
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ccrrssmexnbwmrudhggz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcnJzc21leG5id21ydWRoZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODI3NDgsImV4cCI6MjA0Nzg1ODc0OH0.ztPPu-BkTlqsw0FmjXTHuf2Rzl1OFWyAqN6rDZw-k3w";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Required environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);