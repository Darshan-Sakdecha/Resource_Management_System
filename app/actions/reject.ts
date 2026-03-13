"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export async function rejectBooking(id: number) {
  await prisma.bookings.update({
    where: {
      booking_id: id,
    },
    data: {
      status: "rejected", // ✅ lowercase
    },
  });

  redirect("/management/dashboard/bookings");
}
