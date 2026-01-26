import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateResourceSchema } from "@/app/schemas/resource.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(); // any logged-in user
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }

    const resource = await prisma.resources.findUnique({
      where: {
        resource_id: id,
      },
      include: {
        buildings: true,
        resource_types: true,
      },
    });
    if (!resource) {
      return new Response("Resource not found", { status: 404 });
    }
    return NextResponse.json(resource);
  } catch (error: unknown) {
    let message = "Something went wrong at get_id resource time";

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
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // only Admin/Manager
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const data = updateResourceSchema.parse(body);

    const updatedResource = await prisma.resources.update({
      where: { resource_id: id },
      data: {
        resource_name: data.resource_name,
        resource_type_id: data.resource_type_id,
        building_id: data.building_id,
        floor_number: data.floor_number,
        description: data.description,
      },
    });
    return NextResponse.json(updatedResource);
  } catch (error: unknown) {
    let message = "Something went wrong at update resource time";

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
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // only Admin/Manager
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }

    await prisma.resources.delete({
      where: { resource_id: id },
    });
    return NextResponse.json({ message: "Resource deleted" });
  } catch (error: unknown) {
    let message = "Something went wrong at delete resource time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
