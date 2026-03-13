"use client";

import { useState } from "react";
import Link from "next/link";

interface Booking {
    booking_id: number;
    status: string;
    start_datetime: string;
    end_datetime: string;
    resources: { resource_name: string };
}

interface Props {
    bookings: Booking[];
    deleteBooking: (formData: FormData) => Promise<void>;
}

export default function UserBookingsTable({ bookings, deleteBooking }: Props) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = bookings.filter((b) => {
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesSearch = b.resources.resource_name
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by resource..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded-lg text-black text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded-lg text-black text-sm focus:outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <span className="text-sm text-gray-500 self-center">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead className="bg-teal-100 text-black">
                        <tr>
                            <th className="p-3 text-left border">Resource</th>
                            <th className="p-3 text-left border">Start</th>
                            <th className="p-3 text-left border">End</th>
                            <th className="p-3 text-left border">Status</th>
                            <th className="p-3 text-left border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                        {filtered.map((b) => (
                            <tr key={b.booking_id} className="border-t hover:bg-gray-100 text-black">
                                <td className="p-3 border">{b.resources.resource_name}</td>
                                <td className="p-3 border">{new Date(b.start_datetime).toLocaleString()}</td>
                                <td className="p-3 border">{new Date(b.end_datetime).toLocaleString()}</td>
                                <td className="p-3 border">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                                        b.status === "approved" ? "bg-green-100 text-green-700" :
                                        b.status === "rejected" ? "bg-red-100 text-red-700" :
                                        "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="p-3 border">
                                    <div className="flex gap-2">
                                        {b.status === "pending" && (
                                            <>
                                                <Link
                                                    href={`/user/dashboard/bookings/edit/${b.booking_id}`}
                                                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <form action={deleteBooking}>
                                                    <input type="hidden" name="booking_id" value={b.booking_id} />
                                                    <button
                                                        type="submit"
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                        {b.status !== "pending" && (
                                            <span className="text-sm text-gray-500">
                                                {b.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}