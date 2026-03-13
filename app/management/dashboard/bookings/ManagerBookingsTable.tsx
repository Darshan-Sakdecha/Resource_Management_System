"use client";

import { useState } from "react";

interface Booking {
    booking_id: number;
    status: string;
    start_datetime: string;
    end_datetime: string;
    conflict: string | null;
    user_name: string;
    resources: { resource_name: string };
}

interface Props {
    bookings: Booking[];
    approveBooking: (formData: FormData) => Promise<void>;
    rejectBooking: (formData: FormData) => Promise<void>;
}

export default function ManagerBookingsTable({ bookings, approveBooking, rejectBooking }: Props) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = bookings.filter((b) => {
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const searchLower = search.toLowerCase();
        const matchesSearch =
            b.resources.resource_name.toLowerCase().includes(searchLower) ||
            b.user_name.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by user or resource..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded-lg text-black text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                    <thead className="bg-green-100 text-black">
                        <tr>
                            <th className="p-3 border text-left">User</th>
                            <th className="p-3 border text-left">Resource</th>
                            <th className="p-3 border text-left">Start</th>
                            <th className="p-3 border text-left">End</th>
                            <th className="p-3 border text-left">Status</th>
                            <th className="p-3 border text-left">Warning</th>
                            <th className="p-3 border text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                        {filtered.map((b) => (
                            <tr key={b.booking_id} className="border-t hover:bg-gray-100 text-black">
                                <td className="p-3 border">{b.user_name}</td>
                                <td className="p-3 border">{b.resources.resource_name}</td>
                                <td className="p-3 border">{new Date(b.start_datetime).toLocaleString()}</td>
                                <td className="p-3 border">{new Date(b.end_datetime).toLocaleString()}</td>
                                <td className="p-3 border">
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                                        b.status === "approved" ? "bg-green-200 text-green-800" :
                                        b.status === "rejected" ? "bg-red-200 text-red-800" :
                                        "bg-yellow-200 text-yellow-800"
                                    }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="p-3 border">
                                    {b.conflict === "overlap" && (
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                            ⚠️ Overlapping
                                        </span>
                                    )}
                                    {b.conflict === "maintenance" && (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                            🔧 Maintenance
                                        </span>
                                    )}
                                    {!b.conflict && <span className="text-gray-400 text-xs">—</span>}
                                </td>
                                <td className="p-3 border">
                                    <div className="flex gap-2">
                                        {b.status === "pending" && (
                                            <>
                                                {b.conflict ? (
                                                    <span className="text-xs text-red-500 font-medium">Cannot approve</span>
                                                ) : (
                                                    <form action={approveBooking}>
                                                        <input type="hidden" name="booking_id" value={b.booking_id} />
                                                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                                            Approve
                                                        </button>
                                                    </form>
                                                )}
                                                <form action={rejectBooking}>
                                                    <input type="hidden" name="booking_id" value={b.booking_id} />
                                                    <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                                        Reject
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