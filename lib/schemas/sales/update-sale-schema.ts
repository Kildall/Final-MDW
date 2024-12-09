import { z } from "zod";

const saleProductSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  quantity: z.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser un número",
  }),
});

const saleDeliverySchema = z.object({
  employeeId: z.number({
    required_error: "El  empleado es requerido",
    invalid_type_error: "El empleado tiene que haber sido seleccionado",
  }),
  addressId: z.number({
    required_error: "La dirección es requerida",
    invalid_type_error: "La dirección tiene que haber sido seleccionada",
  }),
  startDate: z
    .string({
      required_error: "La fecha de inicio es requerida",
    })
    .refine((data) => new Date(data) > new Date(), {
      message: "La fecha de inicio debe ser mayor a la fecha actual",
    }),
});

export const updateSaleSchema = z.object({
  saleId: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  products: z
    .array(saleProductSchema)
    .min(1, { message: "Debe haber al menos un producto" }),
  deliveries: z.array(saleDeliverySchema),
  employeeId: z.number({
    required_error: "El empleado es requerido",
    invalid_type_error: "El empleado tiene que haber sido seleccionado",
  }),
  status: z.string({ required_error: "El estado es requerido" }),
});

export type UpdateSaleSchema = z.infer<typeof updateSaleSchema>;
