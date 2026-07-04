import { z } from "zod";
export const customerSchema = z.object({
  name:  z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required").max(32),
});
