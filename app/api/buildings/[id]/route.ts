import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateBuildingSchema } from "@/app/schemas/building.schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid building id" },
        { status: 400 },
      );
    }

    const building = await prisma.buildings.findUnique({
      where: { building_id: id },
    });

    if (!building) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(building);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
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
        { error: "Invalid building id" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateBuildingSchema.parse(body);

    const updatedBuilding = await prisma.buildings.update({
      where: { building_id: id },
      data: {
        building_name: data.building_name,
        building_number: data.building_number,
        total_floors: data.total_floors,
      },
    });

    return NextResponse.json(updatedBuilding);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
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
        { error: "Invalid building id" },
        { status: 400 },
      );
    }

    const deletedBuilding = await prisma.buildings.delete({
      where: { building_id: id },
    });

    return NextResponse.json(deletedBuilding);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
