import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import ManagerCharts from "@/app/components/charts/ManagerCharts";

export default async function ManagerDashboard() {
  await requireAuth([ROLES.MANAGER]);

  const resourceTypes = await prisma.resource_types.findMany({
    include: { resources: true },
  });
  const resourcesByType = resourceTypes.map((t) => ({
    name: t.type_name,
    value: t.resources.length,
  }));

  const buildings = await prisma.buildings.findMany({
    include: { resources: true },
  });
  const resourcesByBuilding = buildings.map((b) => ({
    name: b.building_name,
    value: b.resources.length,
  }));

  const bookings = await prisma.bookings.groupBy({
    by: ["status"],
    _count: true,
  });
  const bookingStats = bookings.map((b) => ({
    name: b.status,
    value: b._count,
  }));

  const maintenance = await prisma.maintenance.groupBy({
    by: ["status"],
    _count: true,
  });
  const maintenanceStats = maintenance.map((m) => ({
    name: m.status,
    value: m._count,
  }));

  const facilities = await prisma.facilities.groupBy({
    by: ["resource_id"],
    _count: true,
  });
  const facilityStats = facilities.map((f) => ({
    name: `Resource ${f.resource_id}`,
    value: f._count,
  }));

  // Summary counts
  const totalResources = await prisma.resources.count();
  const totalBookings = await prisma.bookings.count();
  const totalMaintenance = await prisma.maintenance.count();
  const totalFacilities = await prisma.facilities.count();
  const totalUsers = await prisma.users.count();
  const pendingBookings = await prisma.bookings.count({ where: { status: "pending" } });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Manager Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your resources.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Resources</span>
          <span className="text-3xl font-bold text-black">{totalResources}</span>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Bookings</span>
          <span className="text-3xl font-bold text-black">{totalBookings}</span>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Pending Bookings</span>
          <span className="text-3xl font-bold text-yellow-500">{pendingBookings}</span>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Maintenance</span>
          <span className="text-3xl font-bold text-black">{totalMaintenance}</span>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Facilities</span>
          <span className="text-3xl font-bold text-black">{totalFacilities}</span>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Users</span>
          <span className="text-3xl font-bold text-black">{totalUsers}</span>
        </div>
      </div>

      {/* Charts */}
      <ManagerCharts
        resourcesByType={resourcesByType}
        resourcesByBuilding={resourcesByBuilding}
        bookingStats={bookingStats}
        maintenanceStats={maintenanceStats}
        facilityStats={facilityStats}
      />

    </div>
  );
}