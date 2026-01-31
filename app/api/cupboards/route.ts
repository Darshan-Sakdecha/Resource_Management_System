import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createCupboardSchema } from "@/app/schemas/cupboard.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(req: Request) {
  try {
    // Any logged-in user can view cupboards
    await requireAuth();

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);
    const skip = (page - 1) * pageSize;

    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "cupboard_name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const sortableFields = ["cupboard_name", "total_shelves", "cupboard_id"];

    const safeSortBy = sortableFields.includes(sortBy)
      ? sortBy
      : "cupboard_name";

    const where: Prisma.cupboardsWhereInput = search
      ? {
          cupboard_name: {
            contains: search,
          },
        }
      : {};

    const [cupboards, totalItems] = await Promise.all([
      prisma.cupboards.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [safeSortBy]: sortOrder,
        },
        include: {
          resources: true, // linked resource
        },
      }),
      prisma.cupboards.count({ where }),
    ]);

    return NextResponse.json({
      data: cupboards,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error: unknown) {
    let message = "Error fetching cupboards";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    // Only Admin or Manager can create cupboards
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

    const body = await req.json();

    const data = createCupboardSchema.parse(body);

    const newCupboard = await prisma.cupboards.create({
      data: {
        resource_id: data.resource_id,
        cupboard_name: data.cupboard_name,
        total_shelves: data.total_shelves,
      },
    });

    return NextResponse.json(newCupboard, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating cupboard";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
