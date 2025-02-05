import { z } from "zod";
import { RncTypeEnum, RncDepartmentEnum } from "@/types/rnc";

export const documentSchema = z.string().refine((val) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  const cpfNoFormat = /^\d{11}$/;
  const cnpjNoFormat = /^\d{14}$/;
  
  return cpfRegex.test(val) || 
         cnpjRegex.test(val) || 
         cpfNoFormat.test(val) || 
         cnpjNoFormat.test(val);
}, "Documento inválido");

export const createRNCSchema = z.object({
  company_code: z.string().min(3, "Código deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: documentSchema,
  type: z.nativeEnum(RncTypeEnum),
  department: z.nativeEnum(RncDepartmentEnum),
  responsible: z.string().min(3, "Responsável deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "KORP deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.union([z.literal(""), z.string().min(3, "NFD deve ter no mínimo 3 caracteres")]).nullable().optional(),
  city: z.union([z.literal(""), z.string().min(3, "Cidade deve ter no mínimo 3 caracteres")]).nullable().optional(),
  conclusion: z.union([z.literal(""), z.string().min(10, "Conclusão deve ter no mínimo 10 caracteres")]).nullable().optional(),
  products: z.array(z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    weight: z.number().min(0.1, "Peso deve ser maior que 0")
  })),
  contacts: z.array(z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
    email: z.union([z.literal(""), z.string().email("Email inválido")]).optional()
  })),
  attachments: z.array(z.any()).optional()
});

export const basicInfoSchema = z.object({
  company_code: z.string().min(3, "Código deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: documentSchema,
  type: z.nativeEnum(RncTypeEnum),
  department: z.nativeEnum(RncDepartmentEnum),
  responsible: z.string().min(3, "Responsável deve ter no mínimo 3 caracteres"),
})

export const additionalInfoSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "KORP deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.string().optional(),
  city: z.string().optional(),
  conclusion: z.string().optional(),
  closed_at: z.any().optional(),
  collected_at: z.any().optional(),
})

export const productSchema = z.array(z.object({
  id: z.string(),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  weight: z.number().min(0.1, "Peso deve ser maior que 0")
}))

export const contactSchema = z.array(z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
  email: z.string().optional().nullable()
}))

export const relationalInfoSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    weight: z.number().min(0.1, "Peso deve ser maior que 0")
  })),
  contacts: z.array(z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
    email: z.string().optional().nullable()
  })),
  attachments: z.array(z.union([
    z.instanceof(File),
    z.object({
      id: z.string(),
      rnc_id: z.string(),
      filename: z.string(),
      filesize: z.number(),
      content_type: z.string(),
      file_path: z.string(),
      created_by: z.string(),
      created_at: z.string()
    })
  ])).optional()
})

export const updateRNCSchema = z.object({
  ...basicInfoSchema.shape,
  ...additionalInfoSchema.shape,
  ...relationalInfoSchema.shape
});

export type CreateRNCFormData = z.infer<typeof createRNCSchema>;
export type UpdateRNCFormData = z.infer<typeof updateRNCSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;
export type RelationalInfoFormData = z.infer<typeof relationalInfoSchema>;
