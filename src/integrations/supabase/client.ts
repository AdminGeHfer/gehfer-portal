import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === 'preview--gehfer-portal.lovable.app' ||
                     window.location.hostname === 'gehfer-portal.lovable.app';

let supabaseUrl;
let supabaseAnonKey;

if(isLocalhost) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
} else {
  supabaseUrl = "https://ccrrssmexnbwmrudhggz.supabase.co";
  supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcnJzc21leG5id21ydWRoZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODI3NDgsImV4cCI6MjA0Nzg1ODc0OH0.ztPPu-BkTlqsw0FmjXTHuf2Rzl1OFWyAqN6rDZw-k3w";
}

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