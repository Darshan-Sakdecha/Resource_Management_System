import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createCupboardSchema } from "@/app/schemas/cupboard.schema";

export async function GET() {
  try {
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
