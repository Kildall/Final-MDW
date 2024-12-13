import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
});

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;
