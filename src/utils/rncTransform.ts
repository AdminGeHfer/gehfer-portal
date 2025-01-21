import { RNC } from "@/types/rnc";

export const transformRNCData = (data): RNC => {
  console.log("Raw data received in transformRNCData:", data);
  console.log("Products in raw data:", data.products);

  const transformed = {
    ...data,
    products: data.products || [],
    contact: data.contact?.[0] || { name: "", phone: "", email: "" },
    timeline: (data.events || []).map((event) => ({
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

  console.log("Products after transform:", transformed.products);
  return transformed;
};