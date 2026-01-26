import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createCupboardSchema } from "@/app/schemas/cupboard.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    // Any logged-in user can view cupboards
    await requireAuth();

    const cupboards = await prisma.cupboards.findMany({
      include: {
        resources: true, // linked resource
      },
    });

    return NextResponse.json(cupboards);
  } catch (error: unknown) {
    let message = "Error fetching cupboards";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Only Admin or Manager can create cupboards
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);
    
    const body = await req.json();

    const data = createCupboardSchema.parse(body);

    const newCupboard = await prisma.cupboards.create({
      data: {
        resource_id: data.resource_id,
        cupboard_name: data.cupboard_name,
        total_shelves: data.total_shelves,
      },
    });

    return NextResponse.json(newCupboard, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
