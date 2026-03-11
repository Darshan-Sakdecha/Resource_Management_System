import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createBookingSchema } from "@/app/schemas/booking.schema";

export async function GET(req: Request) {
  try {
    const bookings = await prisma.bookings.findMany({
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
        users_bookings_approver_idTousers: true,
      },
      orderBy: { booking_id: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("GET /bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // ✅ Check for conflicting booking
    const conflict = await prisma.bookings.findFirst({
      where: {
        resource_id: data.resource_id,
        status: { not: "rejected" },
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

    const booking = await prisma.bookings.create({
      data: {
        resource_id: data.resource_id,
        user_id: data.user_id,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        status: "pending",
      },
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("POST /bookings error:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid resource_id or user_id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Error creating booking" },
      { status: 500 },
    );
  }
}
