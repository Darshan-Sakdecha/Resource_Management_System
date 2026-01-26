import { prisma } from "@/app/lib/prisma";
import { updateCupboardSchema } from "@/app/schemas/cupboard.schema";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid cupboard id" },
        { status: 400 },
      );
    }
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
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid cupboard id" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateCupboardSchema.parse(body);

    const updatedCupboard = await prisma.cupboards.update({
      where: { cupboard_id: id },
      data: {
        resource_id: Number(data.resource_id),
        cupboard_name: data.cupboard_name,
        total_shelves: Number(data.total_shelves),
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
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid cupboard id" },
        { status: 400 },
      );
    }

    const deletedCupboard = await prisma.cupboards.delete({
      where: { cupboard_id: id },
    });

    return NextResponse.json(deletedCupboard);
  } catch (error: unknown) {
    let message = "Error deleting cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
