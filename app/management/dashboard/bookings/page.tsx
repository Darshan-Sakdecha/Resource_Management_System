import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";

export default async function ManagerBookings() {

  await requireAuth([ROLES.MANAGER]);

  const bookings = await prisma.bookings.findMany({
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
    },
    orderBy: {
      start_datetime: "desc",
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-200 text-yellow-800",
    approved: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-black">
        Bookings
      </h1>

      <div className="overflow-x-auto">

        <table className="min-w-full bg-white border border-gray-300 text-black">

          {/* Table Head */}
          <thead className="bg-green-100 text-black">
            <tr>
              <th className="p-3 border text-left">User</th>
              <th className="p-3 border text-left">Resource</th>
              <th className="p-3 border text-left">Start</th>
              <th className="p-3 border text-left">End</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {bookings.map((b) => (
              <tr
                key={b.booking_id}
                className="border-t hover:bg-gray-100 text-black"
              >

                <td className="p-3 border">
                  {b.users_bookings_user_idTousers.name}
                </td>

                <td className="p-3 border">
                  {b.resources.resource_name}
                </td>

                <td className="p-3 border">
                  {new Date(b.start_datetime).toLocaleString()}
                </td>

                <td className="p-3 border">
                  {new Date(b.end_datetime).toLocaleString()}
                </td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${statusColors[b.status] || "bg-gray-200 text-black"
                      }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="p-3 border flex gap-2">

                  <Link
                    href={`/management/dashboard/bookings/${b.booking_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}