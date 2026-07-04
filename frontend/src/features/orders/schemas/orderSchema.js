import { z } from "zod";
export const orderSchema = z.object({
  customer_id: z.coerce.number({ invalid_type_error: "Select a customer" }).min(1, "Select a customer"),
  items: z.array(z.object({
    product_id: z.coerce.number({ invalid_type_error: "Select a product" }).min(1, "Select a product"),
    quantity: z.coerce.number().int().min(1, "Minimum 1"),
  })).min(1, "Add at least one item"),
});