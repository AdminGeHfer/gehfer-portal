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

export const basicInfoSchema = z.object({
  company_code: z.string().min(3, "Código deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: documentSchema,
  type: z.nativeEnum(RncTypeEnum),
  department: z.nativeEnum(RncDepartmentEnum),
  responsible: z.string().min(3, "Responsável deve ter no mínimo 3 caracteres")
});

export const additionalInfoSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "KORP deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.string().optional(),
  city: z.string().optional(),
  conclusion: z.string().optional()
});

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  weight: z.number().min(0.1, "Peso deve ser maior que 0")
});

export const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
  email: z.string().email("Email inválido").optional()
});

export type BasicInfoInputs = z.infer<typeof basicInfoSchema>;
export type AdditionalInfoInputs = z.infer<typeof additionalInfoSchema>;
export type ProductInputs = z.infer<typeof productSchema>;
export type ContactInputs = z.infer<typeof contactSchema>;
