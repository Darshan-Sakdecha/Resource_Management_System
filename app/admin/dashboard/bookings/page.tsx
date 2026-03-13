import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";
import AdminBookingsTable from "./AdminBookingsTable";

export default async function BookingsPage() {
  await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

  const bookings = await prisma.bookings.findMany({
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
    },
    orderBy: { booking_id: "desc" },
  });

  const serialized = bookings.map((b) => ({
    ...b,
    start_datetime: b.start_datetime.toISOString(),
    end_datetime: b.end_datetime.toISOString(),
    created_at: b.created_at?.toISOString() ?? null,
    user_name: b.users_bookings_user_idTousers?.name ?? "—",
  }));

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">
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

      <div className="bg-white rounded-2xl shadow border overflow-hidden p-4 space-y-4">
        <AdminBookingsTable bookings={serialized} />
      </div>
    </div>
  );
}