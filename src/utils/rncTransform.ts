import { RNC } from "@/types/rnc";

export const transformRNCData = (data: any): RNC => {
  return {
    ...data,
    contact: data.contact[0] || { name: "", phone: "", email: "" },
    timeline: data.events?.map((event: any) => ({
      id: event.id,
      date: event.created_at,
      title: event.title,
      description: event.description,
      type: event.type,
      userId: event.created_by,
      comment: event.comment
    })) || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    rnc_number: data.rnc_number,
    order_number: data.order_number,
    return_number: data.return_number
  };
};