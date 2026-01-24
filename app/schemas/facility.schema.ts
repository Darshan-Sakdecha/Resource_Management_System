import { z } from "zod";

export const createFacilitySchema = z.object({
  resource_id: z.number().int().positive(),
  facility_name: z.string().min(2).max(100),
  details: z.string().optional(),
});

export const updateFacilitySchema = createFacilitySchema.partial();