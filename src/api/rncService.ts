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

  // Transform the data to match RNC type
  const transformedData: RNC[] = data.map(rnc => ({
    ...rnc,
    contact: rnc.contact[0] || { name: "", phone: "", email: "" },
    timeline: rnc.events.map((event: any) => ({
      id: event.id,
      date: event.created_at,
      title: event.title,
      description: event.description,
      type: event.type,
      userId: event.created_by,
      comment: event.comment
    }))
  }));

  // Update cache
  sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
    data: transformedData,
    timestamp: Date.now()
  }));

  return transformedData;
};

export const invalidateRNCCache = () => {
  sessionStorage.removeItem(RNC_CACHE_KEY);
};