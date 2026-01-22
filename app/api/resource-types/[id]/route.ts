import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  try {
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
  const id = Number((await params).id);
  const { type_name } = await req.json();
  try {
    if (!type_name) {
      return NextResponse.json(
        {
          error: "Resource Type name is required",
        },
        { status: 400 },
      );
    }

    const updateResourceType = await prisma.resource_types.update({
      where: {
        resource_type_id: id,
      },
      data: {
        type_name,
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
  const id = Number((await params).id);
  try {
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
