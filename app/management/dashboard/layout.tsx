import { getAuthUser } from "@/app/lib/auth";
import { ROLES, hasRole } from "@/app/lib/roles";
import { redirect } from "next/navigation";

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user || !hasRole(user.role, [ROLES.ADMIN, ROLES.MANAGER])) {
    redirect("/login");
  }

  return <>{children}</>;
}
