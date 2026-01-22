import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
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
    const id = Number((await params).id);
    const { resource_name, resource_type_id, building_id, description } =
      await req.json();

    const updatedResource = await prisma.resources.update({
      where: { resource_id: id },
      data: {
        resource_name,
        resource_type_id,
        building_id,
        description,
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
    const id = Number((await params).id);
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
