import { z } from "zod";
export const createUserSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email().max(100),
  password: z.string().min(6).max(100),
  role_id: z.number().int().positive(),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(6).max(100).optional(),
  role_id: z.number().int().positive().optional(),
});
