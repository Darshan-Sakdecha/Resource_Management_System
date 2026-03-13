import { prisma } from "@/app/lib/prisma";
import { requireAuth, getAuthUser } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBooking({ params }: PageProps) {
    await requireAuth([ROLES.USER]);
    const currentUser = await getAuthUser();

    const { id } = await params;

    const booking = await prisma.bookings.findUnique({
        where: { booking_id: parseInt(id) },
        include: { resources: true },
    });

    if (!booking || booking.user_id !== currentUser!.user_id) {
        return <div className="text-black">Booking not found</div>;
    }

    const resources = await prisma.resources.findMany();

    async function updateBooking(formData: FormData) {
        "use server";

        const resource_id = Number(formData.get("resource_id"));
        const start_datetime = new Date(String(formData.get("start_datetime")));
        const end_datetime = new Date(String(formData.get("end_datetime")));

        await prisma.bookings.update({
            where: { booking_id: parseInt(id) },
            data: { resource_id, start_datetime, end_datetime },
        });

        redirect("/user/dashboard/bookings");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Edit Booking</h1>
                <Link
                    href="/user/dashboard/bookings"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={updateBooking} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Resource</label>
                        <select name="resource_id" defaultValue={booking.resource_id} className="border p-2 rounded w-full text-black">
                            {resources.map((r) => (
                                <option key={r.resource_id} value={r.resource_id}>
                                    {r.resource_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            name="start_datetime"
                            defaultValue={new Date(booking.start_datetime).toISOString().slice(0, 16)}
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">End Date & Time</label>
                        <input
                            type="datetime-local"
                            name="end_datetime"
                            defaultValue={new Date(booking.end_datetime).toISOString().slice(0, 16)}
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Update Booking
                </button>
            </form>
        </div>
    );
}