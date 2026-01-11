import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role_id } = await req.json();

    // Validate input
    if (!name || !email || !password || !role_id) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        role_id: true,
        created_at: true, // optional
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
