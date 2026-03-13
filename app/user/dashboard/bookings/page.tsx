import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserBookingsTable from "./UserBookingsTable";

export default async function UserBookingsPage() {
  const currentUser = await getAuthUser();
  if (!currentUser) redirect("/login");

  const bookings = await prisma.bookings.findMany({
    where: { user_id: currentUser.user_id },
    include: { resources: true },
    orderBy: { created_at: "desc" },
  });

  async function deleteBooking(formData: FormData) {
    "use server";
    const booking_id = Number(formData.get("booking_id"));
    await prisma.bookings.delete({ where: { booking_id } });
    redirect("/user/dashboard/bookings");
  }

  const serialized = bookings.map((b) => ({
    ...b,
    start_datetime: b.start_datetime.toISOString(),
    end_datetime: b.end_datetime.toISOString(),
    created_at: b.created_at?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">My Bookings</h1>
        <Link
          href="/user/dashboard/bookings/create"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          New Booking
        </Link>
      </div>
      <UserBookingsTable bookings={serialized} deleteBooking={deleteBooking} />
    </div>
  );
}