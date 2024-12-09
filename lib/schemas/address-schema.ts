import { z } from "zod";

export const addressSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  name: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un cadena de texto",
  }),
  street1: z.string({
    required_error: "La calle 1 es requerida",
    invalid_type_error: "La calle 1 debe ser un cadena de texto",
  }),
  street2: z.string().nullable(),
  postalCode: z.string({
    required_error: "El código postal es requerido",
    invalid_type_error: "El código postal debe ser un cadena de texto",
  }),
  state: z.string({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser un cadena de texto",
  }),
  city: z.string({
    required_error: "La ciudad es requerida",
    invalid_type_error: "La ciudad debe ser un cadena de texto",
  }),
  details: z.string().nullable(),
  enabled: z.boolean({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser o verdadero o falso",
  }),
});

export type AddressSchema = z.infer<typeof addressSchema>;
