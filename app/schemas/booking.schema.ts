import { z } from "zod";

export const bookingStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const createBookingSchema = z.object({
  resource_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  start_datetime: z.string().datetime(),
  end_datetime: z.string().datetime(),
});

export const updateBookingSchema = z.object({
  resource_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  start_datetime: z.string().datetime(),
  end_datetime: z.string().datetime(),
});

export const updateBookingStatusSchema = z.object({
  status: bookingStatusEnum,
  approver_id: z.number().int().positive(),
});
