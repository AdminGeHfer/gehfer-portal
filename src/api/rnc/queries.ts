import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";

const RNC_CACHE_KEY = 'rncs';
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export const getRNCs = async (): Promise<RNC[]> => {
  // Check cache first
  const cachedData = sessionStorage.getItem(RNC_CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TIME) {
      return data;
    }
  }

  const { data, error } = await supabase
    .from('rncs')
    .select(`
      id,
      rnc_number,
      company_code,
      company,
      cnpj,
      type,
      description,
      responsible,
      days_left,
      korp,
      nfv,
      nfd,
      collected_at,
      closed_at,
      city,
      conclusion,
      department,
      assigned_at,
      workflow_status,
      status,
      assigned_to,
      assigned_by,
      created_by,
      created_at,
      updated_at,
      products:rnc_products(id, product, weight),
      contact:rnc_contacts(name, phone, email),
      events:rnc_events(id, created_at, created_by, title, description, type)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching RNCs:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  const transformedData = data.map(transformRNCData);
  
  // Update cache
  try {
    sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
      data: transformedData,
      timestamp: Date.now()
    }));
  } catch {
    console.warn('Cache storage failed, clearing old data');
    sessionStorage.clear();
    sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
      data: transformedData,
      timestamp: Date.now()
    }));
  }

  return transformedData;
};

export const getRNCById = async (id: string): Promise<RNC | null> => {
  try {
    console.log('Fetching RNC details for ID:', id);
    const { data, error } = await supabase
      .from('rncs')
      .select(`
        *,
        products:rnc_products(id, product, weight),
        contact:rnc_contacts(*),
        events:rnc_events(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching RNC:', error);
      throw error;
    }

    if (!data) {
      console.log(`No RNC found with id: ${id}`);
      return null;
    }

    console.log('RNC data fetched:', data);
    return transformRNCData(data);
  } catch (error) {
    console.error('Error in getRNCById:', error);
    throw error;
  }
};