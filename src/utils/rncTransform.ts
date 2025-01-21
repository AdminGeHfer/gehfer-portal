import { RNC } from "@/types/rnc";

export const transformRNCData = (data: any): RNC => {
  console.log("Transforming RNC data:", data);
  
  // Ensure products is always an array
  const products = Array.isArray(data.products) ? data.products : [];
  console.log("Products after transformation:", products);

  return {
    ...data,
    products: products,
    contact: data.contact?.[0] || { name: "", phone: "", email: "" },
    timeline: (data.events || []).map((event: any) => ({
      id: event.id,
      date: event.created_at,
      title: event.title,
      description: event.description,
      type: event.type,
      userId: event.created_by
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    rnc_number: data.rnc_number
  };
};