import { z } from "zod";

export const maintenanceStatusEnum = z.enum([
  "scheduled",
  "completed",
  "cancelled",
]);

export const createMaintenanceSchema = z.object({
  resource_id: z.number().int().positive(),
  maintenance_type: z.string().min(2).max(100),
  scheduled_date: z.string().optional(), // DATE
  status: maintenanceStatusEnum,
  notes: z.string().optional(),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial();