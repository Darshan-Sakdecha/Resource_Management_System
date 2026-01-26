import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserSchema } from "@/app/schemas/user.schema";
import { hashPassword } from "@/app/lib/password";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const user = await requireAuth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]);

    // Only ADMIN/MANAGER can view other users; USER can view only themselves
    if (user.roles.role_name === ROLES.USER && user.user_id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const User = await prisma.users.findUnique({
      where: {
        user_id: Number(id),
      },
      include: {
        roles: true,
      },
    });
    if (!User) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password, ...userSafe } = User;
    return NextResponse.json(userSafe);
  } catch (error: unknown) {
    let message = "Error fetching user";
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
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const currentUser = await requireAuth([
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.USER,
    ]);

    // Only ADMIN/MANAGER can update others; USER can update only themselves
    if (
      currentUser.roles.role_name === ROLES.USER &&
      currentUser.user_id !== id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const data = updateUserSchema.parse(body);
    const dataToUpdate: any = { ...data };

    if (data.password) {
      dataToUpdate.password = await hashPassword(data.password);
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: id },
      data: dataToUpdate,
      include: { roles: true },
    });

    const { password, ...userSafe } = updatedUser;
    return NextResponse.json(userSafe);
  } catch (error) {
    let message = "Error updating user";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ===============================
// PATCH – update password only
// ===============================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

    const currentUser = await requireAuth([
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.USER,
    ]);

    // USER can change only their own password
    if (
      currentUser.roles.role_name === ROLES.USER &&
      currentUser.user_id !== id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { newPassword } = await req.json();

    if (!newPassword)
      return NextResponse.json(
        { error: "newPassword required" },
        { status: 400 },
      );

    const hashedPassword = await hashPassword(newPassword);

    await prisma.users.update({
      where: { user_id: id },
      data: { password: hashedPassword },
    });
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error updating password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const currentUser = await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

    // Only ADMIN can delete users
    if (currentUser.roles.role_name !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.users.delete({
      where: {
        user_id: id,
      },
    });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    let message = "Error deleting user";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
