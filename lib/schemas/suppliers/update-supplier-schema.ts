import { z } from "zod";

export const updateSupplierSchema = z.object({
  supplierId: z.number().positive(),
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  enabled: z.boolean(),
});

export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
