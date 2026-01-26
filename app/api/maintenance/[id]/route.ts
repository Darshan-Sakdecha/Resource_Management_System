import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateMaintenanceSchema } from "@/app/schemas/maintenance.schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const maintenance = await prisma.maintenance.findUnique({
      where: { maintenance_id: id },
      include: {
        resources: true, // linked resource
      },
    });

    if (!maintenance) {
      return NextResponse.json(
        { error: "Maintenance record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(maintenance);
  } catch (error: unknown) {
    let message = "Error fetching maintenance record";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateMaintenanceSchema.parse(body);

    const updatedMaintenance = await prisma.maintenance.update({
      where: { maintenance_id: id },
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

    return NextResponse.json(updatedMaintenance);
  } catch (error: unknown) {
    let message = "Error updating maintenance record";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }
    const deletedMaintenance = await prisma.maintenance.delete({
      where: { maintenance_id: id },
    });
    return NextResponse.json(deletedMaintenance);
  } catch (error: unknown) {
    let message = "Error deleting maintenance record";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
