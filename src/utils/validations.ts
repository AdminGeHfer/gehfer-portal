import { z } from "zod";

// Basic Info Validation Schema
export const basicInfoSchema = z.object({
  companyCode: z.string().min(3, "Código da empresa deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: z.string().regex(
    /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)/,
    "Documento inválido. Use um CPF ou CNPJ válido (Ex: 123.456.789-00 ou 12.345.678/0001-00)"
  ),
  type: z.string().min(1, "Tipo é obrigatório"),
  department: z.string().min(1, "Departamento é obrigatório"),
  responsible: z.string().min(1, "Responsável é obrigatório"),
});

// Additional Info Validation Schema
export const additionalInfoSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "Número do pedido deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.string().min(3, "NFD deve ter no mínimo 3 caracteres"),
  city: z.string().optional(),
  conclusion: z.string().optional(),
});

// Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(3, "Produto deve ter no mínimo 3 caracteres"),
  weight: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Peso deve ser um número maior que 0"),
});

// Contact Validation Schema
export const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(
    /\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{3,4}/,
    "Telefone inválido. Use o formato: (99) 99999-9999"
  ),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
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