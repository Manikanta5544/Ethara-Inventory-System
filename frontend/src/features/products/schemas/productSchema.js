import { z } from "zod";

export const productSchema = z.object({
  name:           z.string().min(1, "Name is required").max(255),
  sku:            z.string().min(1, "SKU is required").max(64),
  price:          z.coerce.number({ invalid_type_error: "Enter a valid price" }).min(0, "Price cannot be negative"),
  stock_quantity: z.coerce.number({ invalid_type_error: "Enter a valid quantity" }).int().min(0, "Stock cannot be negative"),
});

export const productUpdateSchema = productSchema.partial();
