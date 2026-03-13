import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import BookingActions from "../BookingActions"; // client component for buttons

interface PageProps {
    params: Promise<{ id: string }>; // params as a Promise
}

export default async function BookingDetails({ params }: PageProps) {
    // await the params Promise
    const { id } = await params;

    // ✅ Server-side query with Prisma
    const booking = await prisma.bookings.findUnique({
        where: { booking_id: parseInt(id) },
        include: {
            resources: { include: { buildings: true, resource_types: true } },
            users_bookings_user_idTousers: true,
        },
    });

    if (!booking) return <div className="text-black">Booking not found</div>;

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-200 text-yellow-800",
        approved: "bg-green-200 text-green-800",
        rejected: "bg-red-200 text-red-800",
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-black">Booking Details</h1>
                <Link
                    href="/management/dashboard/bookings"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            {/* Booking Info */}
            <div className="bg-white border rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-black mb-4">Booking Information</h2>
                <div className="grid grid-cols-2 gap-6 text-black">
                    <div>
                        <p className="text-gray-500 text-sm">User</p>
                        <p className="font-medium">{booking.users_bookings_user_idTousers.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Resource</p>
                        <p className="font-medium">{booking.resources.resource_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Resource Type</p>
                        <p className="font-medium">{booking.resources.resource_types.type_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Building</p>
                        <p className="font-medium">{booking.resources.buildings.building_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Start Time</p>
                        <p className="font-medium">{new Date(booking.start_datetime).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">End Time</p>
                        <p className="font-medium">{new Date(booking.end_datetime).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Status</p>
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${statusColors[booking.status] || "bg-gray-200 text-black"
                                }`}
                        >
                            {booking.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Approve / Reject buttons (only if pending) */}
            {booking.status === "pending" && (
                <BookingActions bookingId={booking.booking_id} />
            )}
        </div>
    );
}