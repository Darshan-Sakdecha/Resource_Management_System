import { z } from "zod";

/**
 * LOGIN
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * REGISTER
 * (Admin or public — depending on your rules)
 */
export const registerSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email().max(100),
  password: z.string().min(6),
  role_id: z.number().int().positive().optional(),
  // optional because:
  // - public register → default role (User)
  // - admin register → role selected
});
