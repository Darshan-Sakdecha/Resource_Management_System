import { prisma } from "@/app/lib/prisma";
import { comparePassword } from "@/app/lib/password";
import { signToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";
import { loginSchema } from "@/app/schemas/auth.schema";
import { isValidRole } from "@/app/lib/roles";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const { email, password } = data;

    const user = await prisma.users.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const role = user.roles.role_name;
    if (!isValidRole(role)) {
      return NextResponse.json(
        { message: "User has an invalid role" },
        { status: 500 },
      );
    }

    const token = signToken({
      userId: user.user_id,
      role,
    });

    const response = NextResponse.json({
      message: "Login successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    let message = "Login failed";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
