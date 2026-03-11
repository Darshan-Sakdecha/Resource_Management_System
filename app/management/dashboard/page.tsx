// app/management/dashboard/page.tsx
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { prisma } from "@/app/lib/prisma";
import StatCard from "@/app/components/dashboard/StatCard";

export default async function ManagerDashboard() {
  // 🔐 Manager-only access
  await requireAuth([ROLES.MANAGER]);

  // 📊 Manager KPIs

  // Promise.all() takes an array of promises and returns a single promise that:
  const [
    pendingBookings,
    approvedBookings,
    scheduledMaintenance,
    totalResources,
  ] = await Promise.all([
    prisma.bookings.count({ where: { status: "pending" } }),
    prisma.bookings.count({ where: { status: "approved" } }),
    prisma.maintenance.count({ where: { status: "scheduled" } }),
    prisma.resources.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-emerald-700">
        Manager Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending Bookings"
          value={pendingBookings}
          color="purple"
        />
        <StatCard
          title="Approved Bookings"
          value={approvedBookings}
          color="green"
        />
        <StatCard
          title="Scheduled Maintenance"
          value={scheduledMaintenance}
          color="blue"
        />
        <StatCard
          title="Total Resources"
          value={totalResources}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <a
            href="/management/dashboard/bookings"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Review Bookings
          </a>

          <a
            href="/management/dashboard/maintenance"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
          >
            View Maintenance
          </a>

          <a
            href="/management/dashboard/resources"
            className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          >
            Manage Resources
          </a>
        </div>
      </div>
    </div>
  );
}
