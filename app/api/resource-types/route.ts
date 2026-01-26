import { prisma } from "@/app/lib/prisma";
import { createResourceTypeSchema } from "@/app/schemas/resource-type.schema";
import { NextResponse } from "next/server";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireAuth(); // any logged-in user
    const resourceTypes = await prisma.resource_types.findMany();
    return NextResponse.json(resourceTypes);
  } catch (error: unknown) {
    let message = "Something went wrong at get resource_type all time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST – only Admin can create new resource types
export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN]);
    const body = await req.json();
    const data = createResourceTypeSchema.parse(body);
    
    const newType = await prisma.resource_types.create({
      data: { type_name: data.type_name },
    });

    return NextResponse.json(newType, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong at insert resource_type time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
