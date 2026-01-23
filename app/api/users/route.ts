import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const { name, email, password, role_id } = await req.json();
    if (!name || !email || !password || !role_id) {
      return NextResponse.json(
        { error: "name, email, password and role_id are required" },
        { status: 400 },
      );
    }

    const saltRounds = process.env.SALT_ROUNDS
      ? parseInt(process.env.SALT_ROUNDS)
      : 10; // You can adjust the number of salt rounds as needed

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: Number(role_id),
      },
    });
    const { password: _, ...userSafe } = newUser;
    return NextResponse.json(userSafe, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating user";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
