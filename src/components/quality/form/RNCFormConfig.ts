import { z } from "zod";
import { RNCFormData } from "@/types/rnc";

export const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["client", "supplier"]),
  department: z.enum(["Expedição", "Logistica", "Comercial", "Qualidade", "Produção"]),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    email: z.string().email("Email inválido"),
  }),
  order_number: z.string().optional(),
  return_number: z.string().optional(),
  company: z.string().min(1, "A empresa é obrigatória"),
  cnpj: z.string().min(14, "CNPJ inválido").max(14),
  workflow_status: z.enum(["open", "analysis", "resolution", "solved", "closing", "closed"]).default("open"),
  assignedTo: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  resolution: z.string().optional(),
});

export const defaultValues: RNCFormData = {
  description: "",
  priority: "medium",
  type: "client",
  department: "Expedição",
  contact: {
    name: "",
    phone: "",
    email: "",
  },
  company: "",
  cnpj: "",
  order_number: "",
  return_number: "",
  workflow_status: "open",
  assignedTo: "",
  attachments: [],
  resolution: "",
};