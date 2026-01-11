import { NextResponse } from "next/server";
import { getAuthUser } from "@/app/lib/auth";

export async function GET() {
  const user = getAuthUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}
