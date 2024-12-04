import { RNC } from "@/types/rnc";
import { validateDepartment, validatePriority, validateType, validateWorkflowStatus } from "./rncValidation";

export const transformRNCData = (data: any): RNC => {
  return {
    id: data.id,
    description: data.description,
    workflow_status: validateWorkflowStatus(data.workflow_status),
    priority: validatePriority(data.priority),
    type: validateType(data.type),
    department: validateDepartment(data.department),
    contact: data.contact[0] || { name: "", phone: "", email: "" },
    company: data.company,
    cnpj: data.cnpj,
    orderNumber: data.order_number,
    returnNumber: data.return_number,
    assignedTo: data.assigned_to,
    assignedBy: data.assigned_by,
    assignedAt: data.assigned_at,
    resolution: "",
    rnc_number: data.rnc_number,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    timeline: data.events.map((event: any) => ({
      id: event.id,
      date: event.created_at,
      title: event.title,
      description: event.description,
      type: event.type,
      userId: event.created_by,
      comment: event.comment
    }))
  };
};