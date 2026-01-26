import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createResourceSchema } from "@/app/schemas/resource.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireAuth(); // any logged-in user
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
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // only Admin/Manager
    const body = await req.json();

    const data = createResourceSchema.parse(body);

    const newResource = await prisma.resources.create({
      data: {
        resource_name: data.resource_name,
        resource_type_id: data.resource_type_id,
        building_id: data.building_id,
        floor_number: data.floor_number,
        description: data.description,
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
