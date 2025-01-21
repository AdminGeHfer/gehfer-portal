import { RNC, TimelineEvent, RNCProduct, RNCContact, WorkflowStatusEnum, RNCTypeEnum } from "@/types/rnc";

interface RawRNCData {
  id: string;
  description: string;
  type: string;
  company: string;
  cnpj: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  created_by: string;
  assigned_to?: string;
  rnc_number?: number;
  assigned_by?: string;
  assigned_at?: string;
  workflow_status: string;
  department: string;
  company_code: string;
  responsible?: string;
  days_left?: number;
  korp?: string;
  nfv?: string;
  nfd?: string;
  collected_at?: string;
  city?: string;
  conclusion?: string;
  products?: {
    product: string;
    weight: number;
    rnc_id: string;
  }[];
  contact?: {
    name: string;
    phone: string;
    email?: string;
  }[];
  events?: {
    id: string;
    created_at: string;
    title: string;
    description: string;
    type: string;
    created_by: string;
  }[];
}

export const transformRNCData = (data: RawRNCData): RNC => {
  console.log("Raw RNC data received:", data);
  
  // Ensure products is always an array and properly transformed
  const products = Array.isArray(data.products) 
    ? data.products.map((p): RNCProduct => ({
        product: p.product,
        weight: p.weight,
        rnc_id: p.rnc_id
      }))
    : [];
  
  console.log("Transformed products:", products);

  // Transform contact data with required email field
  const contact: RNCContact = {
    name: data.contact?.[0]?.name || "",
    phone: data.contact?.[0]?.phone || "",
    email: data.contact?.[0]?.email || ""
  };
  
  // Transform timeline events
  const timeline: TimelineEvent[] = (data.events || []).map((event) => ({
    id: event.id,
    date: event.created_at,
    title: event.title,
    description: event.description,
    type: event.type as "creation" | "update" | "status" | "comment" | "assignment",
    userId: event.created_by
  }));

  const transformedData: RNC = {
    ...data,
    products,
    contact,
    timeline,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    rnc_number: data.rnc_number,
    status: "pending",
    workflow_status: data.workflow_status as WorkflowStatusEnum,
    type: data.type as RNCTypeEnum
  };

  console.log("Final transformed RNC data:", transformedData);
  return transformedData;
};