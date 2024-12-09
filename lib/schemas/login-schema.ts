import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Ingrese un email válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  remember: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
