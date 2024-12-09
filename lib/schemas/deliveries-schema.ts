import { addressSchema } from "./address-schema";
import { employeeSchema } from "./employee-schema";

import { z } from "zod";

export const deliveriesSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  employee: employeeSchema,
  address: addressSchema,
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio debe ser una fecha",
  }),
  lastUpdateDate: z.date({
    required_error: "La fecha de última actualización es requerida",
    invalid_type_error: "La fecha de última actualización debe ser una fecha",
  }),
  status: z.string({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser un cadena de texto",
  }),
  businessStatus: z.string({
    required_error: "El estado de la empresa es requerido",
    invalid_type_error: "El estado de la empresa debe ser un cadena de texto",
  }),
  driverStatus: z.string({
    required_error: "El estado del conductor es requerido",
    invalid_type_error: "El estado del conductor debe ser un cadena de texto",
  }),
});

export type DeliveriesSchema = z.infer<typeof deliveriesSchema>;
