import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export async function GET() {
  try {
    const user = await requireAuth([ROLES.ADMIN]);
    return NextResponse.json({
      message: "Admin dashboard accessed successfully",
      user,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Error" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
  }
}
