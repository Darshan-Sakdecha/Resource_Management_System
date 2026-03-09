"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Box,
  Building2,
} from "lucide-react";

export default function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r p-5">
      <h2 className="text-xl font-bold text-emerald-600 mb-6">
        Manager Panel
      </h2>

      <nav className="space-y-2">
        <NavItem
          href="/management/dashboard"
          active={pathname === "/management/dashboard"}
          icon={<LayoutDashboard size={18} />}
        >
          Dashboard
        </NavItem>

        <NavItem
          href="/management/dashboard/bookings"
          active={pathname.includes("/bookings")}
          icon={<CalendarCheck size={18} />}
        >
          Bookings
        </NavItem>

        <NavItem
          href="/management/dashboard/resources"
          active={pathname.includes("/resources")}
          icon={<Box size={18} />}
        >
          Resources
        </NavItem>

        <NavItem
          href="/management/dashboard/facilities"
          active={pathname.includes("/facilities")}
          icon={<Building2 size={18} />}
        >
          Facilities
        </NavItem>

        <NavItem
          href="/management/dashboard/maintenance"
          active={pathname.includes("/maintenance")}
          icon={<Wrench size={18} />}
        >
          Maintenance
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
            ? "bg-emerald-100 text-emerald-700"
            : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}
