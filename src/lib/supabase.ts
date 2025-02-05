import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

export const supabase = createClient<Database>(
  "https://ccrrssmexnbwmrudhggz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcnJzc21leG5id21ydWRoZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODI3NDgsImV4cCI6MjA0Nzg1ODc0OH0.ztPPu-BkTlqsw0FmjXTHuf2Rzl1OFWyAqN6rDZw-k3w"
)
