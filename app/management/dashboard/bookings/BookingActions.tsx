"use client";

import { approveBooking } from "@/app/actions/approve";
import { rejectBooking } from "@/app/actions/reject";

interface Props {
    bookingId: number;
}

export default function BookingActions({ bookingId }: Props) {
    return (
        <div className="flex gap-3 mt-4">
            <form action={() => approveBooking(bookingId)}>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Approve
                </button>
            </form>
            <form action={() => rejectBooking(bookingId)}>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Reject
                </button>
            </form>
        </div>
    );
}