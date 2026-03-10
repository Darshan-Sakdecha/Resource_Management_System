import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import {
  updateBookingSchema,
  updateBookingStatusSchema,
} from "@/app/schemas/booking.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(); // any logged-in user

    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }
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
  try {
    const user = await requireAuth(); // logged-in user
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateBookingSchema.parse(body);
    // Optional: check if booking is already approved/rejected
    const existing = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Users can only edit their own pending bookings
    if (
      user.user_id !== existing.user_id &&
      user.role !== ROLES.ADMIN &&
      user.role !== ROLES.MANAGER
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
      },
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

// PATCH – update only status / approver_id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth([ROLES.MANAGER, ROLES.ADMIN]); // Only manager/admin can approve
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { status, approver_id } = updateBookingStatusSchema.parse(body);

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: { status, approver_id: user.user_id },
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
    const user = await requireAuth(); // logged-in user
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const existing = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });
    if (!existing)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Users can only cancel their own pending bookings
    if (
      user.user_id !== existing.user_id &&
      user.role !== ROLES.ADMIN &&
      user.role !== ROLES.MANAGER
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deletedBooking = await prisma.bookings.delete({
      where: { booking_id: id },
    });
    return NextResponse.json(deletedBooking);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error deleting booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
