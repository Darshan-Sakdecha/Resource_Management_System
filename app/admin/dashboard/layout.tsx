// app/admin/dashboard/layout.tsx

import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🔐 Protect all admin dashboard routes
  await requireAuth([ROLES.ADMIN]);

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}