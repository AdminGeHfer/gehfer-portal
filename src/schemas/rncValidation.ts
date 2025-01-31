import { z } from "zod";

export const basicInfoSchema = z.object({
  company_code: z.string().min(3, "Código deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: z.string().min(11, "Documento inválido"),
  type: z.string(),
  department: z.string(),
  responsible: z.string().min(3, "Responsável deve ter no mínimo 3 caracteres"),
});

export const additionalInfoSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "KORP deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.string().optional(),
  city: z.string().optional(),
  conclusion: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  weight: z.number().min(0.1, "Peso deve ser maior que 0"),
});

export const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
  email: z.string().email("Email inválido").optional(),
});