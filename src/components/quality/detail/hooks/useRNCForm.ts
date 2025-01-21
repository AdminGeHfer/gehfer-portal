import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RNC, RNCFormData } from "@/types/rnc";
import * as z from "zod";

const formSchema = z.object({
  company_code: z.string().min(1, "O código da empresa é obrigatório"),
  company: z.string().min(1, "O nome da empresa é obrigatória"),
  cnpj: z.union([z.string().nullable(), z.string().regex(/^[0,9]{2}\.[0,9]{3}\.[0,9]{3}\/[0,9]{4}-[0,9]{2}$/, "CNPJ inválido")]).optional().transform(e => e === "" ? undefined : e),
  type: z.enum(["company_complaint", "supplier", "dispatch", "logistics", "deputy", "driver", "financial", "commercial", "financial_agreement"]).default("company_complaint"),
  products: z.array(z.object({
    product: z.string().min(1, "O produto é obrigatório"),
    weight: z.number().min(0, "O peso deve ser maior que 0"),
  })).optional(),
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
  assigned_to: z.string().optional(),
  responsible: z.string().optional(),
});

export const useRNCForm = (rnc: RNC) => {
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_code: rnc.company_code,
      company: rnc.company,
      cnpj: rnc.cnpj,
      type: rnc.type,
      products: rnc.products,
      description: rnc.description,
      korp: rnc.korp,
      nfd: rnc.nfd,
      nfv: rnc.nfv,
      department: rnc.department,
      contact: rnc.contact,
      attachments: rnc.attachments,
      conclusion: rnc.conclusion,
      workflow_status: rnc.workflow_status,
      assigned_to: rnc.assigned_to,
      responsible: rnc.responsible,
    },
  });

  return form;
};