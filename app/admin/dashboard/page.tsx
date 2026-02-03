// app/admin/dashboard/page.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { prisma } from "@/app/lib/prisma";
import StatCard from "@/app/components/dashboard/StatCard";
import AdminStatsChart from "@/app/components/charts/AdminStatsChart";

export default async function AdminDashboard() {
  // 🔐 Admin-only access
  await requireAuth([ROLES.ADMIN]);

  // KPI values
  const [totalUsers, totalResources, totalBookings] = await Promise.all([
    prisma.users.count(),
    prisma.resources.count(),
    prisma.bookings.count(),
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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-blue-700 font-bold">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={totalUsers} color="blue" />
        <StatCard title="Resources" value={totalResources} color="green" />
        <StatCard title="Bookings" value={totalBookings} color="purple" />
      </div>


      {/* Charts */}
      <AdminStatsChart data={chartData} />
    </div>
  );
}
