import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createRoleSchema } from "@/app/schemas/role.schema";

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
    const body = await req.json();
    const data = createRoleSchema.parse(body);

    const newRole = await prisma.roles.create({
      data: {
        role_name: data.role_name,
      },
    });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating role";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
