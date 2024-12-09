import { z } from "zod";
import { addressSchema } from "./address-schema";

export const customerSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  name: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un cadena de texto",
  }),
  phone: z.string({
    required_error: "El teléfono es requerido",
    invalid_type_error: "El teléfono debe ser un cadena de texto",
  }),
  addresses: z.array(addressSchema),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
