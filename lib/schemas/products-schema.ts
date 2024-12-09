import { z } from "zod";

export const productsSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  name: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un cadena de texto",
  }),
  quantity: z.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser un número",
  }),
  measure: z.number({
    required_error: "La medida es requerida",
    invalid_type_error: "La medida debe ser un número",
  }),
  brand: z.string({
    required_error: "La marca es requerida",
    invalid_type_error: "La marca debe ser un cadena de texto",
  }),
  price: z.number({
    required_error: "El precio es requerido",
    invalid_type_error: "El precio debe ser un número",
  }),
  enabled: z.boolean({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser o verdadero o falso",
  }),
});

export type ProductsSchema = z.infer<typeof productsSchema>;
