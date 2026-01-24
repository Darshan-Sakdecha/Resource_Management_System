import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createUserSchema } from "@/app/schemas/user.schema";
import { hashPassword } from "@/app/lib/password";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      include: {
        roles: true,
      },
    });
    const usersSafe = users.map(({ password, ...rest }) => rest);
    return NextResponse.json(usersSafe);
  } catch (error: unknown) {
    let message = "Error fetching users";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = createUserSchema.parse(body);

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role_id: data.role_id,
      },
    });
    const { password, ...userSafe } = newUser;
    return NextResponse.json(userSafe, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating user";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
