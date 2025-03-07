import { RncDepartmentEnum, RncTypeEnum } from "@/types/rnc";
import { z } from "zod";

// Basic Info Validation Schema
export const basicInfoSchema = z.object({
  company_code: z.string().optional(),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: z.string().regex(
    /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)/,
    "Documento inválido. Use um CPF ou CNPJ válido (Ex: 123.456.789-00 ou 12.345.678/0001-00)"
  ).optional(),
  type: z.nativeEnum(RncTypeEnum, {
    required_error: "Tipo é obrigatório"
  }),
  department: z.nativeEnum(RncDepartmentEnum, {
    required_error: "Departamento é obrigatório"
  }),
  responsible: z.string().min(1, "Responsável é obrigatório"),
});

// Additional Info Validation Schema
export const additionalInfoSchema = z.object({
  korp: z.string().min(1, "Número do pedido deve ter no mínimo 1 caracter"),
  nfv: z.string().min(1, "NFV deve ter no mínimo 1 caracter"),
  nfd: z.string().optional(),
  city: z.string().optional(),
  collected_at: z.string().datetime().nullable(),
  closed_at: z.string().datetime().nullable(),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  resolution: z.string().optional(),
  conclusion: z.string().optional(),
});

// Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(3, "Produto deve ter no mínimo 3 caracteres"),
  weight: z.number().min(0.1, "Peso deve ser maior que 0.1"),
});

// Contact Validation Schema
export const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(
    /\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{3,4}/,
    "Telefone inválido. Use o formato: (99) 99999-9999"
  ),
  email: z.union([z.literal(""), z.string().email("Email inválido")]),
});

export const relationalInfoSchema = z.object({
  contacts: z.array(z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    phone: z.string().regex(
      /\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{3,4}/,
      "Telefone inválido. Use o formato: (99) 99999-9999"
    ),
    email: z.union([z.literal(""), z.string().email("Email inválido")]),
  })).min(1, "Adicione pelo menos um contato"),
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do produto é obrigatório"),
    weight: z.number().min(0.1, "Peso deve ser maior que 0")
  })).min(1, "Pelo menos um produto deve ser adicionado"),
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
});

// Input Masks
export const masks = {
  phone: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .slice(0, 15);
  },
  document: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .slice(0, 14);
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .slice(0, 18);
    }
  }
};