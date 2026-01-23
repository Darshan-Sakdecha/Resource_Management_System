import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookings = await prisma.bookings.findMany({
      include: {
        resources: true,
        users_bookings_user_idTousers: true,
        users_bookings_approver_idTousers: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    let message = "Error fetching bookings";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { resource_id, user_id, start_datetime, end_datetime } =
      await req.json();

    if (!resource_id || !user_id || !start_datetime || !end_datetime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const booking = await prisma.bookings.create({
      data: {
        resource_id,
        user_id,
        start_datetime: new Date(start_datetime),
        end_datetime: new Date(end_datetime),
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
