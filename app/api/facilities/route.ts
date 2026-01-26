import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createFacilitySchema } from "@/app/schemas/facility.schema";

export async function GET() {
  try {
    const facilities = await prisma.facilities.findMany();
    return NextResponse.json(facilities);
  } catch (error: unknown) {
    let message = "Something went wrong while fetching facilities";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createFacilitySchema.parse(body);

    const newFacility = await prisma.facilities.create({
      data: {
        facility_name: data.facility_name,
        details: data.details,
        resource_id: data.resource_id,
      },
    });
    return NextResponse.json(newFacility, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong while creating facility";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
