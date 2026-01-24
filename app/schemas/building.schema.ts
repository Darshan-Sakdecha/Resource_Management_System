import { z } from "zod";

export const createBuildingSchema = z.object({
  building_name: z.string().min(2).max(100),
  building_number: z.string().min(1).max(50),
  total_floors: z.number().int().positive(),
});

export const updateBuildingSchema = createBuildingSchema.partial();