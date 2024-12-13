import { z } from "zod";

export const updateProductSchema = z.object({
  productId: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  measure: z.number().min(0.01, "La medida debe ser mayor o igual a 0.01"),
  brand: z.string().min(1, "La marca es requerida"),
  quantity: z.number().min(0, "La cantidad debe ser mayor o igual a 0"),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
