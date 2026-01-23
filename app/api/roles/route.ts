import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await prisma.roles.findMany();
    return NextResponse.json(roles);
  } catch (error: unknown) {
    let message = "Error fetching roles";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { role_name } = await req.json();
    if (!role_name) {
      return NextResponse.json(
        { error: "role_name is required" },
        { status: 400 },
      );
    }
    const newRole = await prisma.roles.create({
      data: {
        role_name,
      },
    });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating role";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
