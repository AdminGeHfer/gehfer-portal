import * as z from "zod";

export const rncContactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal(""))
});

export const rncSchema = z.object({
  rnc_number: z.number().min(1, "Número da RNC é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  contact: rncContactSchema,
  status: z.enum(["open", "in_progress", "resolved"]),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type RNCFormData = z.infer<typeof rncSchema>;
