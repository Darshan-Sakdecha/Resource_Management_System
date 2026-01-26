import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export async function GET() {
  try {
    const user = await requireAuth([ROLES.MANAGER, ROLES.ADMIN]);

    return NextResponse.json({
      message: "Manager reports data",
      accessedBy: {
        id: user.user_id,
        role: user.roles.role_name, 
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
