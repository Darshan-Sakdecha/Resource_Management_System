// app/management/dashboard/page.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export default async function ManagerDashboard() {
  await requireAuth([ROLES.MANAGER]);

  return <h1 className="text-3xl p-6">Manager Dashboard</h1>;
}
