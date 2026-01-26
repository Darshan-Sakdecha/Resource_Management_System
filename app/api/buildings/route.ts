import { prisma } from "@/app/lib/prisma";
import { createBuildingSchema } from "@/app/schemas/building.schema";
import { NextResponse } from "next/server";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    // Any logged-in user can view buildings
    await requireAuth();
    const buildings = await prisma.buildings.findMany();
    return NextResponse.json(buildings);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);
    const body = await req.json();
    const data = createBuildingSchema.parse(body);

    const newBuilding = await prisma.buildings.create({
      data: {
        building_name: data.building_name,
        building_number: data.building_number,
        total_floors: data.total_floors,
      },
    });
    return NextResponse.json(newBuilding, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating building records";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
