import { z } from "zod";

export const createShelfSchema = z.object({
  cupboard_id: z.number().int().positive(),
  shelf_number: z.number().int().positive(),
  capacity: z.number().int().positive(),
  description: z.string().optional(),
});

export const updateShelfSchema = createShelfSchema.partial();