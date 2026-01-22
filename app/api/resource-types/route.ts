import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resourceTypes = await prisma.resource_types.findMany();
    return NextResponse.json(resourceTypes);
  } catch (error: unknown) {
    let message = "Something went wrong at get resource_type all time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type_name } = await req.json();
    if (!type_name) {
      return NextResponse.json(
        {
          error: "Type name is required",
        },
        {
          status: 400,
        },
      );
    }
    const newType = await prisma.resource_types.create({
      data: { type_name },
    });

    return NextResponse.json(newType, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong at insert resource_type time";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
