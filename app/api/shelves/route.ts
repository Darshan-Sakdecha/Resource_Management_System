import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
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
    const sortBy = searchParams.get("sortBy") || "shelf_number";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const sortableFields = [
      "shelf_id",
      "shelf_number",
      "capacity",
      "cupboard_id",
    ];

    const safeSortBy = sortableFields.includes(sortBy)
      ? sortBy
      : "shelf_number";

    const where: Prisma.shelvesWhereInput = search
      ? {
          OR: [
            {
              shelf_number: {
                equals: Number(search) || undefined,
              },
            },
            {
              description: {
                contains: search,
              },
            },
            {
              cupboards: {
                cupboard_name: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {};

    const [shelves, totalItems] = await Promise.all([
      prisma.shelves.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [safeSortBy]: sortOrder,
        },
        include: {
          cupboards: true,
        },
      }),
      prisma.shelves.count({ where }),
    ]);

    return NextResponse.json({
      data: shelves,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shelves" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // restricted
    const { cupboard_id, shelf_number, capacity, description } =
      await req.json();
    if (!cupboard_id || !shelf_number || capacity == null) {
      return NextResponse.json(
        { error: "cupboard_id, shelf_number and capacity are required" },
        { status: 400 },
      );
    }
    const newShelve = await prisma.shelves.create({
      data: {
        cupboard_id: Number(cupboard_id),
        shelf_number,
        capacity: Number(capacity),
        description,
      },
    });
    return NextResponse.json(newShelve, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating shelf";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
