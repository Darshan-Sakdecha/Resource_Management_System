import { prisma } from "@/app/lib/prisma";
import { promises } from "dns";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  try {
    const cupboard = await prisma.cupboards.findUnique({
      where: { cupboard_id: id },
      include: { resources: true },
    });

    if (!cupboard) {
      return NextResponse.json(
        { error: "Cupboard not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(cupboard);
  } catch (error: unknown) {
    let message = "Error fetching cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const { resource_id, cupboard_name, total_shelves } = await req.json();

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: "Invalid cupboard id" },
        { status: 400 },
      );
    }

    if (!resource_id || !cupboard_name || total_shelves == null) {
      return NextResponse.json(
        { error: "resource_id, cupboard_name and total_shelves are required" },
        { status: 400 },
      );
    }

    const updatedCupboard = await prisma.cupboards.update({
      where: { cupboard_id: id },
      data: {
        resource_id: Number(resource_id),
        cupboard_name,
        total_shelves: Number(total_shelves),
      },
    });

    return NextResponse.json(updatedCupboard);
  } catch (error: unknown) {
    let message = "Error updating cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: "Invalid cupboard id" },
        { status: 400 },
      );
    }

    await prisma.cupboards.delete({
      where: { cupboard_id: id },
    });

    return NextResponse.json({ message: "Cupboard deleted successfully" });
  } catch (error: unknown) {
    let message = "Error deleting cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
