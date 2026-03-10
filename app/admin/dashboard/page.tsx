// app/admin/dashboard/page.tsx

import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { prisma } from "@/app/lib/prisma";

import StatCard from "@/app/components/dashboard/StatCard";
import AdminStatsChart from "@/app/components/charts/AdminStatsChart";

import Link from "next/link";
import { Building2, Box, Calendar, Settings, Users } from "lucide-react";

export default async function AdminDashboard() {
  // 🔐 Protect route (Admin only)
  await requireAuth([ROLES.ADMIN]);

  // 📊 Fetch all statistics in parallel
  const [
    totalUsers,
    totalResources,
    totalBookings,
    totalBuildings,
    totalFacilities,
    bookingStats,
  ] = await Promise.all([
    prisma.users.count(),
    prisma.resources.count(),
    prisma.bookings.count(),
    prisma.buildings.count(),
    prisma.facilities.count(),
    prisma.bookings.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // 📈 Prepare chart data
  const chartData = bookingStats.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  // 🧭 Dashboard navigation
  const dashboardLinks = [
    {
      label: "Buildings",
      href: "/admin/dashboard/buildings",
      icon: Building2,
    },
    {
      label: "Facilities",
      href: "/admin/dashboard/facilities",
      icon: Box,
    },
    {
      label: "Resources",
      href: "/admin/dashboard/resources",
      icon: Settings,
    },
    {
      label: "Bookings",
      href: "/admin/dashboard/booking",
      icon: Calendar,
    },
    {
      label: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of the Resource Management System
        </p>
      </div>

      {/* KPI Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Users" value={totalUsers} color="blue" />
        <StatCard title="Resources" value={totalResources} color="green" />
        <StatCard title="Bookings" value={totalBookings} color="purple" />
        <StatCard title="Buildings" value={totalBuildings} color="yellow" />
        <StatCard title="Facilities" value={totalFacilities} color="pink" />
      </div>

      {/* Navigation Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Manage Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dashboardLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <span className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <Icon size={24} />
                </span>

                <span className="text-lg font-semibold text-gray-700">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Booking Status Overview
        </h2>

        <div className="bg-white rounded-xl border p-4">
          <AdminStatsChart data={chartData} />
        </div>
      </div>

    </div>
  );
}