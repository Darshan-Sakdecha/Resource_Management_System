import { z } from "zod";

export const createCupboardSchema = z.object({
  resource_id: z.number().int().positive(),
  cupboard_name: z.string().min(2).max(100),
  total_shelves: z.number().int().positive(),
});

export const updateCupboardSchema = createCupboardSchema.partial();