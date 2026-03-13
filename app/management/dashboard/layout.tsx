// app/manager/dashboard/layout.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import ManagerLayoutClient from "./ManagerLayoutClient";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  // Protect all manager routes
  await requireAuth([ROLES.MANAGER]);

  return <ManagerLayoutClient>{children}</ManagerLayoutClient>;
}