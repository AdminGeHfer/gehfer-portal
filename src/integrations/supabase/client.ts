import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://ccrrssmexnbwmrudhggz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcnJzc21leG5id21ydWRoZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODI3NDgsImV4cCI6MjA0Nzg1ODc0OH0.ztPPu-BkTlqsw0FmjXTHuf2Rzl1OFWyAqN6rDZw-k3w';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add initialization function
export const initializeSupabase = async () => {
  try {
    // Test the connection
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    
    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return false;
  }
};