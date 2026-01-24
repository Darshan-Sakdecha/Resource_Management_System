import { z } from "zod";

export const createResourceSchema = z.object({
  resource_name: z.string().min(2).max(100),
  resource_type_id: z.number().int().positive(),
  building_id: z.number().int().positive(),
  floor_number: z.number().int(),
  description: z.string().optional(),
});

export const updateResourceSchema = createResourceSchema
  .partial()
  .extend({ floor_number: z.number().int().min(0).optional() });
