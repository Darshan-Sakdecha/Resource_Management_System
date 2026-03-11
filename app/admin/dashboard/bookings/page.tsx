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
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen text-black">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-black">
            <CalendarCheck size={26} />
            Bookings
          </h2>

          <p className="text-sm text-black">
            Manage resource bookings
          </p>
        </div>

        <Link
          href="/admin/dashboard/bookings/create"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          + Add Booking
        </Link>

      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm text-black">

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

            {bookings.map((item) => (

              <tr key={item.booking_id} className="border-t">

                <td className="p-4 text-black">{item.booking_id}</td>

                <td className="p-4 text-black">
                  {item.users_bookings_user_idTousers?.name}
                </td>

                <td className="p-4 text-black">
                  {item.resources?.resource_name}
                </td>

                <td className="p-4 text-black">
                  {new Date(item.start_datetime).toLocaleString()}
                </td>

                <td className="p-4 text-black">
                  {new Date(item.end_datetime).toLocaleString()}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-black">
                    {item.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">

                  <Link
                    href={`/admin/dashboard/bookings/${item.booking_id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Link>

                  <DeleteButton
                    id={item.booking_id}
                    name="Booking"
                    apiPath="bookings"
                  />

                </td>

              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}