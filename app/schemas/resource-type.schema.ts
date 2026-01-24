import { z } from "zod";

export const createResourceTypeSchema = z.object({
  type_name: z.string().min(2).max(100),
});

export const updateResourceTypeSchema = createResourceTypeSchema.partial();