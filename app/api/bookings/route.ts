import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createBookingSchema } from "@/app/schemas/booking.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth(); // any logged-in user

    let bookings;

    if (user.roles.role_name === ROLES.USER) {
      // Users see only their own bookings
      bookings = await prisma.bookings.findMany({
        where: { user_id: user.user_id },
        include: {
          resources: true,
          users_bookings_user_idTousers: true,
          users_bookings_approver_idTousers: true,
        },
      });
    } else {
      // Managers/Admin see all bookings
      bookings = await prisma.bookings.findMany({
        include: {
          resources: true,
          users_bookings_user_idTousers: true,
          users_bookings_approver_idTousers: true,
        },
      });
    }

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    let message = "Error fetching bookings";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth(); // any logged-in user
    const body = await req.json();
    const data = createBookingSchema.parse(body);
    // Users can only create bookings for themselves
    if (user.roles.role_name === ROLES.USER && data.user_id !== user.user_id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const booking = await prisma.bookings.create({
      data: {
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        // status → pending (default)
        // approver_id → NULL
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating booking";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
