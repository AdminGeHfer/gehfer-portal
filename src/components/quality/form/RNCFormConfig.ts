import { z } from "zod";
import { RNCFormData } from "@/types/rnc";

export const formSchema = z.object({
  company_code: z.string().min(1, "O código da empresa é obrigatório"),
  company: z.string().min(1, "O nome da empresa é obrigatória"),
  cnpj: z.union([z.string().nullable(), z.string().regex(/^[0,9]{2}\.[0,9]{3}\.[0,9]{3}\/[0,9]{4}-[0,9]{2}$/, "CNPJ inválido")]).optional().transform(e => e === "" ? undefined : e),
  type: z.enum(["company_complaint", "supplier", "dispatch", "logistics", "deputy", "driver", "financial", "commercial", "financial_agreement"]).default("company_complaint"),
  product: z.string().min(1, "O produto é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  weight: z.number().min(0, "O peso deve ser maior que 0"),
  korp: z.string().min(1, "O número do pedido é obrigatório"),
  nfd: z.string().optional(),
  nfv: z.string().optional(),
  department: z.enum(["logistics", "quality", "financial"]).default("logistics"),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().regex(/^[(]{0,1}[0-9]{1,2}[)]{0,1}\s[0-9]{4,5}-[0-9]{4}$/, "Telefone inválido"),
    email: z.union([z.string().nullable(), z.string().email("Email inválido")]).optional().transform(e => e === "" ? undefined : e),
  }),
  attachments: z.array(z.instanceof(File)).optional(),
  conclusion: z.string().optional(),
  workflow_status: z.enum(["open", "analysis", "resolution", "solved", "closing", "closed"]).default("open"),
  assignedTo: z.string().optional(),
});

export const defaultValues: RNCFormData = {
  company_code: "abc",
  company: "abc",
  cnpj: "",
  type: "company_complaint",
  product: "abc",
  description: "abc",
  weight: 1,
  korp: "abc",
  nfd: "",
  nfv: "",
  department: "logistics",
  contact: {
    name: "abc",
    phone: "abc",
    email: "",
  },
  attachments: [],
  conclusion: "",
  workflow_status: "open",
  assignedTo: "",
};