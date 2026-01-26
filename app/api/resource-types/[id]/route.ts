import { prisma } from "@/app/lib/prisma";
import { updateResourceTypeSchema } from "@/app/schemas/resource-type.schema";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const resource_type = await prisma.resource_types.findUnique({
      where: {
        resource_type_id: id,
      },
    });

    if (!resource_type) {
      return NextResponse.json(
        {
          error: "Resorse_type not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(resource_type);
  } catch (error: unknown) {
    let message = "Something went wrong at get_id resource_type time";

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
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateResourceTypeSchema.parse(body);

    const updateResourceType = await prisma.resource_types.update({
      where: {
        resource_type_id: id,
      },
      data: {
        type_name: data.type_name,
      },
    });
    return NextResponse.json(updateResourceType);
  } catch (error: unknown) {
    let message = "Something went wrong at update resource_type time";

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
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const deletedResourceType = await prisma.resource_types.delete({
      where: {
        resource_type_id: id,
      },
    });
    return NextResponse.json(deletedResourceType);
  } catch (error: unknown) {
    let message = "Something went wrong at delete resource_type time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
