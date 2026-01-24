import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserSchema } from "@/app/schemas/user.schema";
import { hashPassword } from "@/app/lib/password";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const user = await prisma.users.findUnique({
      where: {
        user_id: Number(id),
      },
      include: {
        roles: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password, ...userSafe } = user;
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
