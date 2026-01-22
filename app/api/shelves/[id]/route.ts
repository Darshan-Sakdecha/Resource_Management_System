import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const shelve = await prisma.shelves.findUnique({
      where: {
        shelf_id: Number(id),
      },
      include: {
        cupboards: true, // linked cupboard
      },
    });
    if (!shelve) {
      return NextResponse.json({ error: "Shelve not found" }, { status: 404 });
    }
    return NextResponse.json(shelve);
  } catch (error: unknown) {
    let message = "Error fetching shelve";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  const { cupboard_id, shelf_number, capacity, description } = await req.json();
  try {
    const updatedShelve = await prisma.shelves.update({
      where: {
        shelf_id: Number(id),
      },
      data: {
        cupboard_id: Number(cupboard_id),
        shelf_number,
        capacity: Number(capacity),
        description,
      },
    });
    return NextResponse.json(updatedShelve);
  } catch (error: unknown) {
    let message = "Error updating shelve";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  try {
    await prisma.shelves.delete({
      where: {
        shelf_id: Number(id),
      },
    });
    return NextResponse.json({ message: "Shelve deleted successfully" });
  } catch (error: unknown) {
    let message = "Error deleting shelve";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
