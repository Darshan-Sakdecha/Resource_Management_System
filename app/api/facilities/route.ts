import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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
  const { facility_name, details, resource_id } = await req.json();

  try {
    if (!facility_name || !details || !resource_id) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const newFacility = await prisma.facilities.create({
      data: {
        facility_name,
        details,
        resource_id,
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
