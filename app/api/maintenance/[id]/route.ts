import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  try {
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
  const id = Number((await params).id);
  try {
    const { resource_id, maintenance_type, scheduled_date, status, notes } =
      await req.json();

    if (!resource_id || !maintenance_type || !status) {
      return NextResponse.json(
        { error: "resource_id, maintenance_type and status are required" },
        { status: 400 },
      );
    }

    const updatedMaintenance = await prisma.maintenance.update({
      where: { maintenance_id: id },
      data: {
        resource_id: Number(resource_id),
        maintenance_type,
        scheduled_date: scheduled_date ? new Date(scheduled_date) : null,
        status,
        notes,
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
  const id = Number((await params).id);
  try {
    await prisma.maintenance.delete({
      where: { maintenance_id: id },
    });
    return NextResponse.json({ message: "Maintenance record deleted" });
  } catch (error: unknown) {
    let message = "Error deleting maintenance record";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
