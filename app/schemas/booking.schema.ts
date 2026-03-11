import { z } from "zod";

export const bookingStatusEnum = z.enum(["pending", "approved", "rejected"]);

// Helper to validate datetime strings flexibly
const datetimeString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid datetime format",
});

export const createBookingSchema = z
  .object({
    resource_id: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val)),
    user_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
    start_datetime: datetimeString,
    end_datetime: datetimeString,
  })
  .refine(
    (data) => new Date(data.start_datetime) < new Date(data.end_datetime),
    {
      message: "start_datetime must be before end_datetime",
      path: ["end_datetime"],
    },
  );

export const updateBookingSchema = z
  .object({
    resource_id: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val)),
    user_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
    start_datetime: datetimeString,
    end_datetime: datetimeString,
    status: bookingStatusEnum.optional(),
  })
  .refine(
    (data) => new Date(data.start_datetime) < new Date(data.end_datetime),
    {
      message: "start_datetime must be before end_datetime",
      path: ["end_datetime"],
    },
  );

export const updateBookingStatusSchema = z.object({
  status: bookingStatusEnum,
  approver_id: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val)),
});
