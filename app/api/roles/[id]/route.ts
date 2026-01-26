import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateRoleSchema } from "@/app/schemas/role.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
     // Only Admin can update roles
    await requireAuth([ROLES.ADMIN]);

    const id = Number((await params).id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    const body = await req.json();
    const data = updateRoleSchema.parse(body);

    const updatedRole = await prisma.roles.update({
      where: {
        role_id: id,
      },
      data: {
        role_name: data.role_name,
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
  try {
    // Only Admin can delete roles
    await requireAuth([ROLES.ADMIN]);
    
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

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
