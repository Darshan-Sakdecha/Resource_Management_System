import { prisma } from "@/app/lib/prisma";
import { createBuildingSchema } from "@/app/schemas/building.schema";
import { NextResponse } from "next/server";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";
import { Prisma } from "@/app/generated/prisma/client";


export async function GET(req: Request) {
  try {
    // Any authenticated user can view buildings
    await requireAuth();

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);

    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "building_name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const sortableFields = [
      "building_name",
      "building_number",
      "total_floors",
      "building_id",
    ];

    const safeSortBy = sortableFields.includes(sortBy)
      ? sortBy
      : "building_name";

    const skip = (page - 1) * pageSize;

    const where: Prisma.buildingsWhereInput = search
      ? {
          OR: [
            {
              building_name: {
                contains: search,
              },
            },
            {
              building_number: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const [buildings, totalItems] = await Promise.all([
      prisma.buildings.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [safeSortBy]: sortOrder,
        },
      }),
      prisma.buildings.count({ where }),
    ]);

    return NextResponse.json({
      data: buildings,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch buildings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

    const body = await req.json();
    const data = createBuildingSchema.parse(body);

    const newBuilding = await prisma.buildings.create({
      data: {
        building_name: data.building_name,
        building_number: data.building_number,
        total_floors: data.total_floors,
      },
    });

    return NextResponse.json(newBuilding, { status: 201 });
  } catch (error: any) {
    // 🔥 Unique constraint error (e.g. building_number)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Building number already exists" },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create building" },
      { status: 500 },
    );
  }
}
