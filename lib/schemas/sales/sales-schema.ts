import { z } from "zod";
import { customerSchema } from "../customer-schema";
import { deliveriesSchema } from "../deliveries-schema";
import { employeeSchema } from "../employee-schema";
import { productsSchema } from "../products-schema";

export const salesSchema = z.object({
  id: z.number(),
  customer: customerSchema,
  employee: employeeSchema,
  products: z.array(productsSchema),
  deliveries: z.array(deliveriesSchema),
  startDate: z.date().optional(),
  lastUpdateDate: z.date().optional(),
  status: z.string(),
});

export type SalesSchema = z.infer<typeof salesSchema>;
