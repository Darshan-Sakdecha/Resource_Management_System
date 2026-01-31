import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { createUserSchema } from "@/app/schemas/user.schema";
import { hashPassword } from "@/app/lib/password";
import { ROLES } from "@/app/lib/roles";
import { requireAuth } from "@/app/lib/auth";

const ALLOWED_SORT_FIELDS = ["name", "email", "role_id", "created_at"] as const;

export async function GET(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN, ROLES.MANAGER]); // only Admin/Manager can view

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);
    const skip = (page - 1) * pageSize;


    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy as any)
      ? sortBy
      : "name";

    const search = searchParams.get("search")?.trim();
    const where = search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }
      : {};


    const [users, totalItems] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          roles: true,
        },
      }),
      prisma.users.count({ where }),
    ]);

    /* Remove passwords before sending response */
    const usersSafe = users.map(({ password, ...rest }) => rest);

    return NextResponse.json({
      data: usersSafe,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error fetching users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth([ROLES.ADMIN]); // Only admin can create new users
    const body = await req.json();

    const data = createUserSchema.parse(body);

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role_id: data.role_id,
      },
    });
    const { password, ...userSafe } = newUser;
    return NextResponse.json(userSafe, { status: 201 });
  } catch (error: unknown) {
    let message = "Error creating user";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
