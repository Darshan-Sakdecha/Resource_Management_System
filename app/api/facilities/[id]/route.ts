import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { updateFacilitySchema } from "@/app/schemas/facility.schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid facility ID" },
        { status: 400 },
      );
    }
    const facilitie = await prisma.facilities.findUnique({
      where: {
        facility_id: id,
      },
    });
    if (!facilitie) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(facilitie);
  } catch (error: unknown) {
    let message = "Something went wrong while fetching facility";

    if (error instanceof Error) {
      message = error.message;
    }
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
        { error: "Invalid facility ID" },
        { status: 400 },
      );
    }
    const body = await req.json();
    const data = updateFacilitySchema.parse(body);
    const updatedFacility = await prisma.facilities.update({
      where: {
        facility_id: id,
      },
      data: {
        facility_name: data.facility_name,
        details: data.details,
        resource_id: data.resource_id,
      },
    });
    return NextResponse.json(updatedFacility);
  } catch (error: unknown) {
    let message = "Something went wrong while updating facility";

    if (error instanceof Error) {
      message = error.message;
    }
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
        { error: "Invalid facility ID" },
        { status: 400 },
      );
    }
    const deletedFacility = await prisma.facilities.delete({
      where: {
        facility_id: id,
      },
    });
    return NextResponse.json(deletedFacility);
  } catch (error: unknown) {
    let message = "Something went wrong while deleting facility";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
