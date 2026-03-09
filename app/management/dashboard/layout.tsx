import { getAuthUser } from "@/app/lib/auth";
import { ROLES, hasRole } from "@/app/lib/roles";
import { redirect } from "next/navigation";
import ManagementSidebar from "@/app/components/sidebar/ManagementSidebar";

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  // 🔐 Allow only Admin & Manager
  if (!user || !hasRole(user.role, [ROLES.ADMIN, ROLES.MANAGER])) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <ManagementSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
