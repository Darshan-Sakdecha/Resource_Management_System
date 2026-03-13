import { prisma } from "@/app/lib/prisma";
import { requireAuth, getAuthUser } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ErrorMessage from "./ErrorMessage";

export default async function CreateBooking() {
    await requireAuth([ROLES.USER]);

    const resources = await prisma.resources.findMany();

    async function createBooking(formData: FormData) {
        "use server";

        const currentUser = await getAuthUser();
        const resource_id = Number(formData.get("resource_id"));
        const start_datetime = new Date(String(formData.get("start_datetime")));
        const end_datetime = new Date(String(formData.get("end_datetime")));

        // ✅ Check overlapping approved bookings
        const overlapping = await prisma.bookings.findFirst({
            where: {
                resource_id,
                status: "approved",
                AND: [
                    { start_datetime: { lt: end_datetime } },
                    { end_datetime: { gt: start_datetime } },
                ],
            },
        });

        if (overlapping) {
            redirect("/user/dashboard/bookings/create?error=overlap");
        }

        // ✅ Check maintenance scheduled for this resource
        const maintenance = await prisma.maintenance.findFirst({
            where: {
                resource_id,
                status: "scheduled",
                scheduled_date: {
                    gte: start_datetime,
                    lte: end_datetime,
                },
            },
        });

        if (maintenance) {
            redirect("/user/dashboard/bookings/create?error=maintenance");
        }

        await prisma.bookings.create({
            data: {
                resource_id,
                user_id: currentUser!.user_id,
                start_datetime,
                end_datetime,
                status: "pending",
            },
        });

        redirect("/user/dashboard/bookings");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">New Booking</h1>
                <Link
                    href="/user/dashboard/bookings"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            {/* ✅ Error message shown here */}
            <Suspense fallback={null}>
                <ErrorMessage />
            </Suspense>

            <form action={createBooking} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Resource</label>
                        <select name="resource_id" className="border p-2 rounded w-full text-black">
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
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">End Date & Time</label>
                        <input
                            type="datetime-local"
                            name="end_datetime"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                    Submit Booking
                </button>
            </form>
        </div>
    );
}