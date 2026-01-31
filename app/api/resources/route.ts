import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createResourceSchema } from "@/app/schemas/resource.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(req: Request) {
  try {
    await requireAuth(); // any logged-in user

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);
    const skip = (page - 1) * pageSize;

    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "resource_name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const sortableFields = [
      "resource_id",
      "resource_name",
      "floor_number",
      "building_id",
      "resource_type_id",
    ];

    const safeSortBy = sortableFields.includes(sortBy)
      ? sortBy
      : "resource_name";

    const where: Prisma.resourcesWhereInput = search
      ? {
          OR: [
            {
              resource_name: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
              },
            },
            {
              buildings: {
                building_name: {
                  contains: search,
                },
              },
            },
            {
              resource_types: {
                type_name: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {};

    const [resources, totalItems] = await Promise.all([
      prisma.resources.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [safeSortBy]: sortOrder,
        },
        include: {
          buildings: true,
          resource_types: true,
        },
      }),
      prisma.resources.count({ where }),
    ]);

    return NextResponse.json({
      data: resources,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // only Admin/Manager
    const body = await req.json();

    const data = createResourceSchema.parse(body);

    const newResource = await prisma.resources.create({
      data: {
        resource_name: data.resource_name,
        resource_type_id: data.resource_type_id,
        building_id: data.building_id,
        floor_number: data.floor_number,
        description: data.description,
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong at insert resource time";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
