"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Box,
  Calendar,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-indigo-600 px-6 py-4 text-white shadow">
        <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] p-5">
          <nav className="space-y-2">
            <NavItem
              href="/admin/dashboard"
              icon={<LayoutDashboard size={18} />}
              active={pathname === "/admin/dashboard"}
            >
              Dashboard
            </NavItem>

            <NavItem
              href="/admin/dashboard/buildings"
              icon={<Home size={18} />}
              active={pathname.includes("buildings")}
            >
              Buildings
            </NavItem>

            <NavItem
              href="/admin/dashboard/facilities"
              icon={<Box size={18} />}
              active={pathname.includes("facilities")}
            >
              Facilities
            </NavItem>

            <NavItem
              href="/admin/dashboard/maintenance"
              icon={<Calendar size={18} />}
              active={pathname.includes("maintenance")}
            >
              Maintenance
            </NavItem>

            <NavItem
              href="/admin/dashboard/resources"
              icon={<Settings size={18} />}
              active={pathname.includes("resources")}
            >
              Resources
            </NavItem>

            <NavItem
              href="/admin/dashboard/roles"
              icon={<Users size={18} />}
              active={pathname.includes("roles")}
            >
              Roles
            </NavItem>

            <NavItem
              href="/admin/dashboard/users"
              icon={<Users size={18} />}
              active={pathname.includes("users")}
            >
              Users
            </NavItem>
          </nav>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-10">
            © 2026 Admin Panel
          </p>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// NAV ITEM COMPONENT
function NavItem({
  href,
  icon,
  active,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition
        ${
          active
            ? "bg-indigo-100 text-indigo-600"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}
