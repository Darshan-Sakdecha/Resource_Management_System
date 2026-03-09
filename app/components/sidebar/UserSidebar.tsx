"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Box,
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r p-5">
      <h2 className="text-xl font-bold text-indigo-600 mb-6">
        User Panel
      </h2>

      <nav className="space-y-2">
        <NavItem
          href="/user/dashboard"
          active={pathname === "/user/dashboard"}
          icon={<LayoutDashboard size={18} />}
        >
          Dashboard
        </NavItem>

        <NavItem
          href="/user/dashboard/bookings"
          active={pathname.includes("/bookings")}
          icon={<Calendar size={18} />}
        >
          My Bookings
        </NavItem>

        <NavItem
          href="/user/dashboard/resources"
          active={pathname.includes("/resources")}
          icon={<Box size={18} />}
        >
          Resources
        </NavItem>
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition
        ${
          active
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}
