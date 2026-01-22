import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resources = await prisma.resource_types.findMany({
      include: {
        resources: {
          include: {
            buildings: true,
            resource_types: true,
          },
        },
      },
    });
    return NextResponse.json(resources);
  } catch (error: unknown) {
    let message = "Something went at resource getAll time wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      resource_name,
      resource_type_id,
      building_id,
      floor_number,
      description,
    } = await req.json();

    if (
      !resource_name ||
      !resource_type_id ||
      !building_id ||
      floor_number === undefined
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const newResource = await prisma.resources.create({
      data: {
        resource_name,
        resource_type_id,
        building_id,
        floor_number,
        description,
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong at insert resource time";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
