"use server";

import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";
import { Role } from "./roles";
import { AuthUser } from "./types";

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);

    return (await prisma.users.findUnique({
      where: { user_id: decoded.userId },
      include: { roles: true },
    })) as AuthUser;
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && !allowedRoles.includes(user.roles.role_name)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
