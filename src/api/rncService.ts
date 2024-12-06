import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";
import { toast } from "sonner";

const RNC_CACHE_KEY = 'rncs';
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const getRNCs = async (): Promise<RNC[]> => {
  try {
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
        description,
        workflow_status,
        priority,
        type,
        department,
        company,
        cnpj,
        order_number,
        return_number,
        assigned_to,
        assigned_by,
        assigned_at,
        rnc_number,
        created_at,
        updated_at,
        closed_at,
        contact:rnc_contacts(name, phone, email),
        events:rnc_events(
          id, 
          created_at, 
          title, 
          description, 
          type, 
          created_by
        )
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
    } catch (e) {
      console.warn('Cache storage failed, clearing old data');
      sessionStorage.clear();
      sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
        data: transformedData,
        timestamp: Date.now()
      }));
    }

    return transformedData;
  } catch (error) {
    console.error('Error in getRNCs:', error);
    throw error;
  }
};

export const getRNCById = async (id: string): Promise<RNC | null> => {
  try {
    let query = supabase
      .from('rncs')
      .select(`
        *,
        contact:rnc_contacts(*),
        events:rnc_events(*)
      `);

    // Check if id is UUID or RNC number
    if (isValidUUID(id)) {
      query = query.eq('id', id);
    } else {
      const rncNumber = parseInt(id);
      if (isNaN(rncNumber)) {
        toast.error("Número de RNC inválido");
        return null;
      }
      query = query.eq('rnc_number', rncNumber);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching RNC:', error);
      throw error;
    }

    if (!data) {
      console.log(`No RNC found with identifier: ${id}`);
      toast.error("RNC não encontrada");
      return null;
    }

    return transformRNCData(data);
  } catch (error) {
    console.error('Error in getRNCById:', error);
    throw error;
  }
};

export const subscribeToRNCChanges = (id: string, onUpdate: (rnc: RNC) => void) => {
  if (!isValidUUID(id)) {
    console.error(`Invalid UUID format for subscription: ${id}`);
    return () => {};
  }

  const subscription = supabase
    .channel(`rnc_${id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rncs',
        filter: `id=eq.${id}`
      },
      async (payload) => {
        if (payload.new) {
          const updatedRNC = await getRNCById(id);
          if (updatedRNC) {
            onUpdate(updatedRNC);
          }
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
