import { z } from "zod";

const idSchema = z.object({
  id: z
    .custom<number>()
    .refine((value) => value ?? false, "Required")
    .refine((value) => Number.isFinite(Number(value)), "Invalid number")
    .transform((value) => Number(value)),
});

export { idSchema };

