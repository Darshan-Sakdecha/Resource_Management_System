import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const building = await prisma.buildings.findUnique({
      where: {
        building_id: parseInt(id),
      },
    });
    if (!building) {
      return NextResponse.json(
        {
          error: "Building not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(building);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { building_name, building_number, total_floors } = await req.json();

  try {
    const updatedBuilding = await prisma.buildings.update({
      where: {
        building_id: parseInt(id),
      },
      data: {
        building_name,
        building_number,
        total_floors,
      },
    });
    return NextResponse.json(updatedBuilding);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.buildings.delete({
      where: {
        building_id: parseInt(id),
      },
    });
    return NextResponse.json({ message: "Building deleted" });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
