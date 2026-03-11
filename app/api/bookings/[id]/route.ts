import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateBookingSchema } from "@/app/schemas/booking.schema";

export async function GET(
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
  } catch (error: any) {
    console.error("GET /bookings/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching booking" },
      { status: 500 },
    );
  }
}

export async function PUT(
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

    const existingBooking = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();

    const parsed = updateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // ✅ Check for conflicting booking (exclude current booking)
    const conflict = await prisma.bookings.findFirst({
      where: {
        resource_id: data.resource_id,
        status: { not: "rejected" },
        NOT: { booking_id: id },
        AND: [
          { start_datetime: { lt: new Date(data.end_datetime) } },
          { end_datetime: { gt: new Date(data.start_datetime) } },
        ],
      },
      include: {
        resources: true,
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          error: `"${conflict.resources?.resource_name}" is already booked from ${new Date(conflict.start_datetime).toLocaleString()} to ${new Date(conflict.end_datetime).toLocaleString()}. Please choose a different time.`,
        },
        { status: 409 },
      );
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: {
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        ...(data.status && { status: data.status }),
      },
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("PUT /bookings/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid resource_id or user_id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Error updating booking" },
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

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const existingBooking = await prisma.bookings.findUnique({
      where: { booking_id: id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await prisma.bookings.delete({
      where: { booking_id: id },
    });

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE /bookings/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || "Error deleting booking" },
      { status: 500 },
    );
  }
}
