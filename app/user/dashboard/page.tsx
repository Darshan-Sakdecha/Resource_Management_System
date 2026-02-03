// app/user/dashboard/page.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export default async function UserDashboard() {
  await requireAuth([ROLES.USER]);

  return <h1 className="text-3xl p-6">User Dashboard</h1>;
}
