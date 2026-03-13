"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export async function approveBooking(id: number) {
  await prisma.bookings.update({
    where: {
      booking_id: id,
    },
    data: {
      status: "approved", // ✅ lowercase
    },
  });

  redirect("/management/dashboard/bookings");
}
