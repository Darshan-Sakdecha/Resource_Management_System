import {z} from "zod";

export const createRoleSchema = z.object({
    role_name: z.string().min(3).max(50),
});

export const updateRoleSchema = createRoleSchema.partial();