import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const booking = await prisma.bookings.findUnique({
      where: {
        booking_id: id,
      },
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
  } catch (error: unknown) {
    let message = "Error fetching booking";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  const { resource_id, user_id, start_datetime, end_datetime } =
    await req.json();
  try {
    if (!resource_id || !user_id || !start_datetime || !end_datetime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    // Optional: check if booking is already approved/rejected
    const existing = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (existing.status !== "pending") {
      return NextResponse.json(
        { error: "Cannot edit booking after approval/rejection" },
        { status: 403 },
      );
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: {
        resource_id,
        user_id,
        start_datetime: new Date(start_datetime),
        end_datetime: new Date(end_datetime),
      },
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
        users_bookings_approver_idTousers: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {}
}

// PATCH – update only status / approver_id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const { status, approver_id } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: { status, approver_id },
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
        users_bookings_approver_idTousers: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error updating booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE – cancel booking
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    await prisma.bookings.delete({ where: { booking_id: id } });
    return NextResponse.json({ message: "Booking canceled successfully" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error deleting booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
