import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createBookingSchema } from "@/app/schemas/booking.schema";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export async function GET() {
  await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

  const bookings = await prisma.bookings.findMany({
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
      users_bookings_approver_idTousers: true,
    },
    orderBy: {
      booking_id: "desc",
    },
  });

  return NextResponse.json({ data: bookings });
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    const body = await req.json();

    const data = createBookingSchema.parse(body);

    const booking = await prisma.bookings.create({
      data: {
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating booking" },
      { status: 500 },
    );
  }
}
