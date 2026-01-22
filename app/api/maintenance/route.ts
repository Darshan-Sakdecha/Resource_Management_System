import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const maintenance = await prisma.maintenance.findMany({
      include: {
        resources: true, // linked resource
      },
    });

    return NextResponse.json(maintenance);
  } catch (error: unknown) {
    let message = "Error fetching maintenance records";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
    const {
      resource_id,
      maintenance_type,
      scheduled_date,
      status,
      notes,
    } = await req.json();

    if (!resource_id || !maintenance_type || !status) {
      return NextResponse.json(
        { error: "resource_id, maintenance_type and status are required" },
        { status: 400 }
      );
    }

    const newMaintenance = await prisma.maintenance.create({
      data: {
        resource_id: Number(resource_id),
        maintenance_type,
        scheduled_date: scheduled_date
          ? new Date(scheduled_date)
          : null,
        status,
        notes,
      },
    });
    return NextResponse.json(newMaintenance, { status: 201 });
    } catch (error: unknown) {
        let message = "Error creating maintenance record";
        if (error instanceof Error) message = error.message;
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
