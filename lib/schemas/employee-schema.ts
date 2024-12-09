import { z } from "zod";

export const employeeSchema = z.object({
  id: z.number({
    required_error: "El ID es requerido",
    invalid_type_error: "El ID debe ser un número",
  }),
  name: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un cadena de texto",
  }),
  position: z.string({
    required_error: "El cargo es requerido",
    invalid_type_error: "El cargo debe ser un cadena de texto",
  }),
  enabled: z.boolean({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser o verdadero o falso",
  }),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
