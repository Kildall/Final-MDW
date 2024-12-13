import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(1, "El nombre es requerido"),
  price: z
    .number({ required_error: "El precio es requerido" })
    .min(0, "El precio debe ser mayor o igual a 0"),
  measure: z
    .number({ required_error: "La medida es requerida" })
    .min(0.01, "La medida debe ser mayor o igual a 0.01"),
  brand: z
    .string({ required_error: "La marca es requerida" })
    .min(1, "La marca es requerida"),
  quantity: z
    .number({ required_error: "La cantidad es requerida" })
    .min(0, "La cantidad debe ser mayor o igual a 0"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
