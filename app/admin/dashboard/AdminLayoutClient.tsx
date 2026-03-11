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
  Archive,
  Layers,
} from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.replace("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Buildings", href: "/admin/dashboard/buildings", icon: Home },
    { label: "Facilities", href: "/admin/dashboard/facilities", icon: Box },
    { label: "Maintenance", href: "/admin/dashboard/maintenance", icon: Calendar },
    { label: "Resources", href: "/admin/dashboard/resources", icon: Settings },
    { label: "Bookings", href: "/admin/dashboard/bookings", icon: Calendar },
    { label: "Roles", href: "/admin/dashboard/roles", icon: Users },
    { label: "Users", href: "/admin/dashboard/users", icon: Users },
    { label: "Cupboards", href: "/admin/dashboard/cupboards", icon: Layers },
    { label: "Shelves", href: "/admin/dashboard/shelves", icon: Archive },
    {
      label: "Resource Types",
      href: "/admin/dashboard/resource-types",
      icon: Settings,
    },
  ];

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
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition
                    ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="text-xs text-gray-400 mt-10">
            © 2026 Resource Management System
          </p>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}