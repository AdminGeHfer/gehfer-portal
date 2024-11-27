import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";

const RNC_CACHE_KEY = 'rncs';
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

export const getRNCs = async (): Promise<RNC[]> => {
  // Check cache first
  const cachedData = sessionStorage.getItem(RNC_CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TIME) {
      return data;
    }
  }

  // If no cache or expired, fetch from API
  const { data, error } = await supabase
    .from('rncs')
    .select(`
      *,
      contact:rnc_contacts(*),
      events:rnc_events(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Update cache
  sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
};

export const invalidateRNCCache = () => {
  sessionStorage.removeItem(RNC_CACHE_KEY);
};