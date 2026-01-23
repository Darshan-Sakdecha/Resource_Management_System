import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const { role_name } = await req.json();
    if (!role_name) {
      return NextResponse.json(
        { error: "role_name is required" },
        { status: 400 },
      );
    }
    const updatedRole = await prisma.roles.update({
      where: {
        role_id: id,
      },
      data: {
        role_name,
      },
    });
    return NextResponse.json(updatedRole);
  } catch (error: unknown) {
    let message = "Error updating role";
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
    await prisma.roles.delete({
      where: {
        role_id: id,
      },
    });
    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    let message = "Error deleting role";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
