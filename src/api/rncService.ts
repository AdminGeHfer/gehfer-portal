import { RNC } from "@/types/rnc";
import { supabase } from "@/integrations/supabase/client";

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

  // If no cache or expired, fetch from API with optimized query
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
      events:rnc_events(id, created_at, title, description, type, created_by, comment)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform the data to match RNC type
  const transformedData: RNC[] = data.map(rnc => ({
    id: rnc.id,
    description: rnc.description,
    workflow_status: rnc.workflow_status || "open",
    priority: validatePriority(rnc.priority),
    type: validateType(rnc.type),
    department: rnc.department,
    contact: rnc.contact[0] || { name: "", phone: "", email: "" },
    company: rnc.company,
    cnpj: rnc.cnpj,
    orderNumber: rnc.order_number,
    returnNumber: rnc.return_number,
    assignedTo: rnc.assigned_to,
    assignedBy: rnc.assigned_by,
    assignedAt: rnc.assigned_at,
    resolution: "",
    rnc_number: rnc.rnc_number,
    created_at: rnc.created_at,
    updated_at: rnc.updated_at,
    closed_at: rnc.closed_at,
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

  // Update cache with compression
  const compressedData = JSON.stringify({
    data: transformedData,
    timestamp: Date.now()
  });
  
  try {
    sessionStorage.setItem(RNC_CACHE_KEY, compressedData);
  } catch (e) {
    console.warn('Cache storage failed, clearing old data');
    sessionStorage.clear();
    sessionStorage.setItem(RNC_CACHE_KEY, compressedData);
  }

  return transformedData;
};

// Helper function to validate priority
const validatePriority = (priority: string): "low" | "medium" | "high" => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    default:
      return "medium";
  }
};

// Helper function to validate type
const validateType = (type: string): "client" | "supplier" => {
  switch (type?.toLowerCase()) {
    case "client":
      return "client";
    case "supplier":
      return "supplier";
    default:
      return "client";
  }
};

export const invalidateRNCCache = () => {
  sessionStorage.removeItem(RNC_CACHE_KEY);
};