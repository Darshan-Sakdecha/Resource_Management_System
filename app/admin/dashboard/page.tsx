// app/admin/dashboard/page.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { prisma } from "@/app/lib/prisma";
import StatCard from "@/app/components/dashboard/StatCard";
import AdminStatsChart from "@/app/components/charts/AdminStatsChart";
import Link from "next/link";
import { Building2, Box, Calendar, Settings, Users } from "lucide-react";

export default async function AdminDashboard() {
  // 🔐 Admin-only access
  await requireAuth([ROLES.ADMIN]);

  // Fetch counts once
  const [totalUsers, totalResources, totalBookings, totalBuildings, totalFacilities] =
    await Promise.all([
      prisma.users.count(),
      prisma.resources.count(),
      prisma.bookings.count(),
      prisma.buildings.count(),
      prisma.facilities.count(),
    ]);

  // Booking status chart data
  const bookingStats = await prisma.bookings.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const chartData = bookingStats.map(item => ({
    status: item.status,
    count: item._count.status,
  }));

  // Table navigation cards (no duplicate counts)
  const tableCards = [
    { label: "Buildings", href: "/admin/dashboard/buildings", icon: Building2 },
    { label: "Facilities", href: "/admin/dashboard/facilities", icon: Box },
    { label: "Resources", href: "/admin/dashboard/resources", icon: Settings },
    { label: "Bookings", href: "/admin/dashboard/bookings", icon: Calendar },
    { label: "Users", href: "/admin/dashboard/users", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-blue-700 font-bold">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={totalUsers} color="blue" />
        <StatCard title="Resources" value={totalResources} color="green" />
        <StatCard title="Bookings" value={totalBookings} color="purple" />
        <StatCard title="Buildings" value={totalBuildings} color="blue" />
        <StatCard title="Facilities" value={totalFacilities} color="green" />
      </div>

      {/* Table Navigation Cards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Manage Tables</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tableCards.map(card => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow hover:shadow-lg transition"
              >
                <span className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <Icon size={24} />
                </span>
                <span className="text-lg font-semibold text-gray-700">{card.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Bookings Status</h3>
        <AdminStatsChart data={chartData} />
      </div>
    </div>
  );
}
