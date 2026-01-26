import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireAuth(); // any logged-in user
    const shelve = await prisma.shelves.findMany({
      include: {
        cupboards: true, // linked cupboard
      },
    });
    return NextResponse.json(shelve);
  } catch (error: unknown) {
    let message = "Error fetching cupboards";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // restricted
    const { cupboard_id, shelf_number, capacity, description } =
      await req.json();
    if (!cupboard_id || !shelf_number || capacity == null) {
      return NextResponse.json(
        { error: "cupboard_id, shelf_number and capacity are required" },
        { status: 400 },
      );
    }
    const newShelve = await prisma.shelves.create({
      data: {
        cupboard_id: Number(cupboard_id),
        shelf_number,
        capacity: Number(capacity),
        description,
      },
    });
    return NextResponse.json(newShelve, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating shelf";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
