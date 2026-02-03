import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";
import { registerSchema } from "@/app/schemas/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const { name, email, password } = data; // remove role_id from client input

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with role = User (role_id = 1)
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: 1, // always User
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        role_id: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    let message = "Something went wrong at register time";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
