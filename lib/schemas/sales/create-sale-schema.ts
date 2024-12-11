import { z } from "zod";

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
export const createSaleSchema = z.object({
  customerId: z
    .number({
      required_error: "El cliente es requerido",
      invalid_type_error: "El cliente tiene que haber sido seleccionado",
    })
    .positive({
      message: "El cliente tiene que haber sido seleccionado",
    }),
  products: z
    .array(
      z.object({
        productId: z
          .number({
            required_error: "El producto es requerido",
            invalid_type_error: "El producto tiene que haber sido seleccionado",
          })
          .positive({
            message: "El producto tiene que haber sido seleccionado",
          }),
        quantity: z
          .number({
            required_error: "La cantidad es requerida",
            invalid_type_error: "La cantidad tiene que haber sido seleccionada",
          })
          .positive({
            message: "La cantidad tiene que haber sido seleccionada",
          }),
      })
    )
    .min(1, {
      message: "Debe haber al menos un producto",
    }),
  deliveries: z.array(
    z.object({
      employeeId: z
        .number({
          required_error: "El empleado es requerido",
          invalid_type_error: "El empleado tiene que haber sido seleccionado",
        })
        .positive({
          message: "El empleado tiene que haber sido seleccionado",
        }),
      addressId: z
        .number({
          required_error: "La dirección es requerida",
          invalid_type_error: "La dirección tiene que haber sido seleccionada",
        })
        .positive({
          message: "La dirección tiene que haber sido seleccionada",
        }),
      startDate: z
        .string({
          required_error: "La fecha de inicio es requerida",
        })
        .refine((data) => new Date(data) > new Date(), {
          message: "La fecha de inicio debe ser mayor a la fecha actual",
        }),
    })
  ),
  startDate: z
    .string({
      required_error: "La fecha de inicio es requerida",
    })
    .refine((data) => new Date(data) > new Date(), {
      message: "La fecha de inicio debe ser mayor a la fecha actual",
    }),
  employeeId: z
    .number({
      required_error: "El empleado es requerido",
      invalid_type_error: "El empleado tiene que haber sido seleccionado",
    })
    .positive({
      message: "El empleado tiene que haber sido seleccionado",
    }),
});
