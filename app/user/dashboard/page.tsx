import { prisma } from "@/app/lib/prisma";
import { requireAuth, getAuthUser } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import UserCharts from "@/app/components/charts/UserCharts";

export default async function UserDashboard() {
  await requireAuth([ROLES.USER]);
  const currentUser = await getAuthUser();

  // Summary counts
  const totalResources = await prisma.resources.count();
  const totalBuildings = await prisma.buildings.count();
  const totalFacilities = await prisma.facilities.count();

  const myBookings = await prisma.bookings.findMany({
    where: { user_id: currentUser!.user_id },
    include: { resources: true },
  });

  const totalMyBookings = myBookings.length;
  const pendingBookings = myBookings.filter((b) => b.status === "pending").length;
  const approvedBookings = myBookings.filter((b) => b.status === "approved").length;

  // Bookings by status for chart
  const bookingsByStatus = [
    { name: "Pending", value: myBookings.filter((b) => b.status === "pending").length },
    { name: "Approved", value: myBookings.filter((b) => b.status === "approved").length },
    { name: "Rejected", value: myBookings.filter((b) => b.status === "rejected").length },
  ].filter((b) => b.value > 0);

  // Resources by type for chart
  const resourceTypes = await prisma.resource_types.findMany({
    include: { resources: true },
  });
  const resourcesByType = resourceTypes.map((t) => ({
    name: t.type_name,
    value: t.resources.length,
  }));

  // My bookings by resource for chart
  const bookingsByResourceMap: Record<string, number> = {};
  myBookings.forEach((b) => {
    const name = b.resources.resource_name;
    bookingsByResourceMap[name] = (bookingsByResourceMap[name] || 0) + 1;
  });
  const bookingsByResource = Object.entries(bookingsByResourceMap).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">User Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {currentUser!.name}! Here's your overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border-l-4 border-teal-500 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Resources</span>
          <span className="text-3xl font-bold text-black">{totalResources}</span>
        </div>
        <div className="bg-white border-l-4 border-teal-500 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Buildings</span>
          <span className="text-3xl font-bold text-black">{totalBuildings}</span>
        </div>
        <div className="bg-white border-l-4 border-teal-500 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Total Facilities</span>
          <span className="text-3xl font-bold text-black">{totalFacilities}</span>
        </div>
        <div className="bg-white border-l-4 border-teal-500 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">My Total Bookings</span>
          <span className="text-3xl font-bold text-black">{totalMyBookings}</span>
        </div>
        <div className="bg-white border-l-4 border-yellow-400 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Pending Bookings</span>
          <span className="text-3xl font-bold text-yellow-500">{pendingBookings}</span>
        </div>
        <div className="bg-white border-l-4 border-teal-400 rounded-lg shadow p-5 flex flex-col gap-1">
          <span className="text-gray-500 text-sm">Approved Bookings</span>
          <span className="text-3xl font-bold text-teal-600">{approvedBookings}</span>
        </div>
      </div>

      {/* Charts */}
      <UserCharts
        bookingsByStatus={bookingsByStatus}
        resourcesByType={resourcesByType}
        bookingsByResource={bookingsByResource}
      />

    </div>
  );
}