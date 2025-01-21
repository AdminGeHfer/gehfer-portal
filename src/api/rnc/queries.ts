import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";

const RNC_CACHE_KEY = "rncs";
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export const getRNCs = async (): Promise<RNC[]> => {
  try {
    const cachedData = sessionStorage.getItem(RNC_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_TIME) {
        return data;
      }
    }

    // First get all RNCs
    const { data: rncs, error: rncsError } = await supabase
      .from("rncs")
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
        products:rnc_products(id, rnc_id, product, weight),
        contact:rnc_contacts(name, phone, email),
        events:rnc_events(id, created_at, created_by, title, description, type)
      `)
      .order("created_at", { ascending: false });

    if (rncsError) {
      console.error("Error fetching RNCs:", rncsError);
      throw rncsError;
    }

    if (!rncs || rncs.length === 0) {
      console.warn("No RNC data found");
      return [];
    }

    const transformedData = rncs.map(transformRNCData);
    console.log("[Vite] Transformed RNC data (list):", transformedData);

    sessionStorage.setItem(
      RNC_CACHE_KEY,
      JSON.stringify({ data: transformedData, timestamp: Date.now() })
    );

    return transformedData;
  } catch (error) {
    console.error("Error in getRNCs:", error);
    throw error;
  }
};

export const getRNCById = async (id: string): Promise<RNC | null> => {
  try {
    console.log("[Vite] Fetching RNC details for ID:", id);
    
    const { data, error } = await supabase
      .from("rncs")
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
        products:rnc_products(id, rnc_id, product, weight),
        contact:rnc_contacts(name, phone, email),
        events:rnc_events(id, created_at, created_by, title, description, type)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[Vite] Error fetching RNC by ID:", error);
      throw error;
    }

    if (!data) {
      console.log(`[Vite] No RNC found with ID: ${id}`);
      return null;
    }

    console.log("[Vite] Raw RNC data (detail):", data);
    const transformedData = transformRNCData(data);
    console.log("[Vite] Transformed RNC data (detail):", transformedData);
    return transformedData;
  } catch (error) {
    console.error("[Vite] Error in getRNCById:", error);
    throw error;
  }
};