import { RNC, TimelineEvent, RNCProduct, RNCContact, StatusEnum, WorkflowStatusEnum, RNCTypeEnum, DepartmentEnum } from "@/types/rnc";

interface RawRNCEvent {
  id: string;
  created_at: string;
  title: string;
  description: string;
  type: string;
  created_by: string;
}

interface RawRNCProduct {
  product: string;
  weight: number;
}

interface RawRNCContact {
  name: string;
  phone: string;
  email?: string;
}

export interface RawRNCData {
  id: string;
  description: string;
  type: RNCTypeEnum;
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
  workflow_status: WorkflowStatusEnum;
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
  products?: RawRNCProduct[];
  contact?: RawRNCContact[];
  events?: RawRNCEvent[];
  status?: StatusEnum;
}

export const transformRNCData = (data: RawRNCData): RNC => {
  console.log("Raw RNC data received:", data);

  // Transform products with proper typing
  const products: RNCProduct[] = (data.products || []).map((product) => ({
    product: product.product,
    weight: product.weight
  }));
  
  console.log("Transformed products:", products);

  // Transform timeline events
  const timeline: TimelineEvent[] = (data.events || []).map((event) => ({
    id: event.id,
    date: event.created_at,
    title: event.title,
    description: event.description,
    type: event.type as "creation" | "update" | "status" | "comment" | "assignment",
    userId: event.created_by
  }));

  // Transform contact with required email field
  const contact: RNCContact = {
    name: data.contact?.[0]?.name || "",
    phone: data.contact?.[0]?.phone || "",
    email: data.contact?.[0]?.email || ""
  };

  const transformedData: RNC = {
    ...data,
    products,
    contact,
    timeline,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at || "",
    rnc_number: data.rnc_number || 0,
    status: data.status || "not_created",
    workflow_status: data.workflow_status,
    type: data.type,
    department: data.department as DepartmentEnum,
    conclusion: data.conclusion || ""
  };

  console.log("Final transformed RNC data:", transformedData);
  return transformedData;
};