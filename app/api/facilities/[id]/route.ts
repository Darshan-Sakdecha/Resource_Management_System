import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
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
  const id = Number((await params).id);
  const { facility_name, details, resource_id } = await req.json();
  try {
    const updatedFacility = await prisma.facilities.update({
      where: {
        facility_id: id,
      },
      data: {
        facility_name,
        details,
        resource_id,
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
  const id = Number((await params).id);
  try {
    await prisma.facilities.delete({
      where: {
        facility_id: id,
      },
    });
    return NextResponse.json({ message: "Facility deleted successfully" });
  } catch (error: unknown) {
    let message = "Something went wrong while deleting facility";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

