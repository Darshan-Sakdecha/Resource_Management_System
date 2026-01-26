import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createMaintenanceSchema } from "@/app/schemas/maintenance.schema";
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
    const body = await req.json();
    const data = createMaintenanceSchema.parse(body);

    const newMaintenance = await prisma.maintenance.create({
      data: {
        resource_id: Number(data.resource_id),
        maintenance_type: data.maintenance_type,
        scheduled_date: data.scheduled_date
          ? new Date(data.scheduled_date)
          : null,
        status: data.status,
        notes: data.notes || null,
      },
    });
    return NextResponse.json(newMaintenance, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating maintenance record";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
