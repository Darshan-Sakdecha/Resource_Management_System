import { prisma } from "@/app/lib/prisma";
import { comparePassword } from "@/app/lib/password";
import { signToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signToken({
    userId: user.user_id,
    role: user.roles.role_name,
  });

  const response = NextResponse.json({
    message: "Login successful",
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
