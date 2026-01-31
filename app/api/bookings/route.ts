import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createBookingSchema } from "@/app/schemas/booking.schema";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";
import { Prisma, $Enums } from "@/app/generated/prisma/client";

const ALLOWED_SORT_FIELDS = [
  "start_datetime",
  "end_datetime",
  "status",
  "created_at",
] as const;

function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}
function buildBookingWhere(
  user: any,
  searchParams: URLSearchParams,
): Prisma.bookingsWhereInput {
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status");
  const resourceId = searchParams.get("resource_id");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const where: Prisma.bookingsWhereInput = {};

  if (user.roles.role_name === ROLES.USER) {
    where.user_id = user.user_id;
  }

  if (search) {
    where.OR = [
      { resources: { resource_name: { contains: search } } },
      { users_bookings_user_idTousers: { name: { contains: search } } },
    ];
  }

  // Status filter (ENUM-safe)
  if (status && Object.values($Enums.bookings_status).includes(status as any)) {
    where.status = status as $Enums.bookings_status;
  }

  // Resource filter
  if (resourceId) {
    where.resource_id = Number(resourceId);
  }

  // Date range filter
  if (fromDate || toDate) {
    where.start_datetime = {
      ...(fromDate && { gte: new Date(fromDate) }),
      ...(toDate && { lte: new Date(toDate) }),
    };
  }

  return where;
}

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);

    const { page, pageSize, skip } = getPagination(searchParams);

    const sortBy = searchParams.get("sortBy") || "start_datetime";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy as any)
      ? sortBy
      : "start_datetime";

    const where = buildBookingWhere(user, searchParams);

    const [bookings, totalItems] = await Promise.all([
      prisma.bookings.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          resources: true,
          users_bookings_user_idTousers: true,
          users_bookings_approver_idTousers: true,
        },
      }),
      prisma.bookings.count({ where }),
    ]);

    return NextResponse.json({
      data: bookings,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error fetching bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const data = createBookingSchema.parse(body);

    // Users can only create bookings for themselves
    const userId =
      user.roles.role_name === ROLES.USER ? user.user_id : data.user_id;

    const booking = await prisma.bookings.create({
      data: {
        resource_id: data.resource_id,
        user_id: userId,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating booking";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
