import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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
    const { resource_id, cupboard_name, total_shelves } = await req.json();

    if (!resource_id || !cupboard_name || total_shelves == null) {
      return NextResponse.json(
        { error: "resource_id, cupboard_name and total_shelves are required" },
        { status: 400 },
      );
    }

    const newCupboard = await prisma.cupboards.create({
      data: {
        resource_id: Number(resource_id),
        cupboard_name,
        total_shelves: Number(total_shelves),
      },
    });

    return NextResponse.json(newCupboard, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
