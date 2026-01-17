import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
    const { building_name, building_number, total_floors } = await req.json();
    if (!building_name || !building_number || !total_floors) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    const newBuilding = await prisma.buildings.create({
      data: {
        building_name,
        building_number,
        total_floors,
      },
    });
    return NextResponse.json(newBuilding, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
