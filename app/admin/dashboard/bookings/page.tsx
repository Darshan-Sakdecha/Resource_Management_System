import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { CalendarCheck, Edit2 } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

export default async function BookingsPage() {
  await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

  const bookings = await prisma.bookings.findMany({
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
    },
    orderBy: { booking_id: "desc" },
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-black">
            <CalendarCheck size={26} />
            Bookings
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage resource bookings</p>
        </div>
        <Link
          href="/admin/dashboard/bookings/create"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Add Booking
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left font-medium">ID</th>
                  <th className="p-4 text-left font-medium">User</th>
                  <th className="p-4 text-left font-medium">Resource</th>
                  <th className="p-4 text-left font-medium">Start</th>
                  <th className="p-4 text-left font-medium">End</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr
                    key={item.booking_id}
                    className="border-t hover:bg-indigo-50/30 transition"
                  >
                    <td className="p-4 text-black">{item.booking_id}</td>
                    <td className="p-4 text-black">
                      {item.users_bookings_user_idTousers?.name ?? "—"}
                    </td>
                    <td className="p-4 text-black">
                      {item.resources?.resource_name ?? "—"}
                    </td>
                    <td className="p-4 text-black">
                      {new Date(item.start_datetime).toLocaleString()}
                    </td>
                    <td className="p-4 text-black">
                      {new Date(item.end_datetime).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(item.status)}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/dashboard/bookings/${item.booking_id}`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Link>
                        <DeleteButton
                          id={item.booking_id}
                          name="Booking"
                          apiPath="bookings"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}