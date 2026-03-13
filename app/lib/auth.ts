"use server";

import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";
import { Role, isValidRole } from "./roles";
import { AuthUser } from "./types";

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = verifyToken(token);

    const user = await prisma.users.findUnique({
      where: { user_id: decoded.userId },
      include: { roles: true },
    });

    if (!user || !user.roles) return null;

    const roleName = user.roles.role_name;

    if (!isValidRole(roleName)) {
      return null;
    }

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: roleName, // Role ✅
    };
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // ✅ Add this temporarily
  console.log("==================");
  console.log("User role:", JSON.stringify(user.role));
  console.log("Allowed roles:", JSON.stringify(allowedRoles));
  console.log("Includes check:", allowedRoles?.includes(user.role));
  console.log("==================");

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
