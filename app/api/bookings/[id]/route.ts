import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateBookingSchema } from "@/app/schemas/booking.schema";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);

  const booking = await prisma.bookings.findUnique({
    where: { booking_id: id },
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
      users_bookings_approver_idTousers: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);

    const body = await req.json();

    const data = updateBookingSchema.parse(body);

    const existing = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: {
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        status: data.status,
      },
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);

    const deleted = await prisma.bookings.delete({
      where: { booking_id: id },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting booking" },
      { status: 500 },
    );
  }
}
