import { z } from "zod";
import { RNCFormData } from "@/types/rnc";

export const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["client", "supplier"]),
  department: z.enum(["Expedição", "Logistica", "Comercial", "Qualidade", "Produção"]),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().regex(/^[(]{0,1}[0-9]{1,2}[)]{0,1}\s[0-9]{4,5}-[0-9]{4}$/, "Telefone inválido"),
    email: z.union([z.string().nullable(), z.string().email("Email inválido")]).optional().transform(e => e === "" ? undefined : e),
  }),
  order_number: z.string().min(1).max(10, "O número do pedido deve ter no máximo 10 caracteres"),
  return_number: z.string().optional(),
  company: z.string().min(1, "O nome da empresa é obrigatória"),
  cnpj: z.union([z.string().nullable(), z.string().regex(/^[0,9]{2}\.[0,9]{3}\.[0,9]{3}\/[0,9]{4}-[0,9]{2}$/, "CNPJ inválido")]).optional().transform(e => e === "" ? undefined : e),
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