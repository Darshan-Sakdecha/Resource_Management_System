import { prisma } from "@/app/lib/prisma";
import { requireAuth, getAuthUser } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { redirect } from "next/navigation";
import ManagerBookingsTable from "./ManagerBookingsTable";

export default async function ManagerBookings() {
  await requireAuth([ROLES.MANAGER]);

  const bookings = await prisma.bookings.findMany({
    include: {
      resources: true,
      users_bookings_user_idTousers: true,
    },
    orderBy: { start_datetime: "desc" },
  });

  const bookingsWithConflicts = await Promise.all(
    bookings.map(async (b) => {
      if (b.status !== "pending") return { ...b, conflict: null };

      const overlapConflict = await prisma.bookings.findFirst({
        where: {
          resource_id: b.resource_id,
          booking_id: { not: b.booking_id },
          status: "approved",
          AND: [
            { start_datetime: { lt: b.end_datetime } },
            { end_datetime: { gt: b.start_datetime } },
          ],
        },
      });

      const maintenanceConflict = await prisma.maintenance.findFirst({
        where: {
          resource_id: b.resource_id,
          status: "scheduled",
          scheduled_date: {
            gte: b.start_datetime,
            lte: b.end_datetime,
          },
        },
      });

      return {
        ...b,
        conflict: overlapConflict ? "overlap" : maintenanceConflict ? "maintenance" : null,
      };
    })
  );

  async function approveBooking(formData: FormData) {
    "use server";
    const booking_id = Number(formData.get("booking_id"));
    const currentUser = await getAuthUser();
    const booking = await prisma.bookings.findUnique({ where: { booking_id } });

    if (booking) {
      const maintenanceConflict = await prisma.maintenance.findFirst({
        where: {
          resource_id: booking.resource_id,
          status: "scheduled",
          scheduled_date: {
            gte: booking.start_datetime,
            lte: booking.end_datetime,
          },
        },
      });

      if (maintenanceConflict) {
        await prisma.bookings.update({
          where: { booking_id },
          data: { status: "rejected", approver_id: currentUser!.user_id },
        });
        redirect("/management/dashboard/bookings");
      }
    }

    await prisma.bookings.update({
      where: { booking_id },
      data: { status: "approved", approver_id: currentUser!.user_id },
    });
    redirect("/management/dashboard/bookings");
  }

  async function rejectBooking(formData: FormData) {
    "use server";
    const booking_id = Number(formData.get("booking_id"));
    const currentUser = await getAuthUser();
    await prisma.bookings.update({
      where: { booking_id },
      data: { status: "rejected", approver_id: currentUser!.user_id },
    });
    redirect("/management/dashboard/bookings");
  }

  const serialized = bookingsWithConflicts.map((b) => ({
    ...b,
    start_datetime: b.start_datetime.toISOString(),
    end_datetime: b.end_datetime.toISOString(),
    created_at: b.created_at?.toISOString() ?? null,
    user_name: b.users_bookings_user_idTousers.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Bookings</h1>
        <div className="flex gap-4 text-sm">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
            Pending: {bookings.filter((b) => b.status === "pending").length}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            Approved: {bookings.filter((b) => b.status === "approved").length}
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
            Rejected: {bookings.filter((b) => b.status === "rejected").length}
          </span>
        </div>
      </div>
      <ManagerBookingsTable
        bookings={serialized}
        approveBooking={approveBooking}
        rejectBooking={rejectBooking}
      />
    </div>
  );
}