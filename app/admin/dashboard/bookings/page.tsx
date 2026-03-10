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
    orderBy: {
      booking_id: "desc",
    },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-xl">
              <CalendarCheck size={26} className="text-indigo-600"/>
            </span>
            Bookings
          </h2>

          <p className="text-sm text-indigo-500 mt-1">
            Manage resource bookings
          </p>
        </div>

        <Link
          href="/admin/dashboard/bookings/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-700"
        >
          + Add Booking
        </Link>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Resource</th>
              <th className="p-4 text-left">Start</th>
              <th className="p-4 text-left">End</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (

              bookings.map((item, index) => (
                <tr
                  key={item.booking_id}
                  className={`border-t hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >

                  <td className="p-4 text-gray-800 font-medium">
                    {item.booking_id}
                  </td>

                  <td className="p-4 text-gray-800">
                    {item.users_bookings_user_idTousers?.name ?? "-"}
                  </td>

                  <td className="p-4 text-gray-800">
                    {item.resources?.resource_name ?? "-"}
                  </td>

                  <td className="p-4 text-gray-700">
                    {new Date(item.start_datetime).toLocaleString()}
                  </td>

                  <td className="p-4 text-gray-700">
                    {new Date(item.end_datetime).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/admin/dashboard/bookings/${item.booking_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      <Edit2 size={16}/>
                      Edit
                    </Link>

                    <DeleteButton
                      id={item.booking_id}
                      name="Booking"
                      apiPath="bookings"
                    />

                  </td>

                </tr>
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}