"use client";

import { useState } from "react";

interface Booking {
    booking_id: number;
    status: string;
    start_datetime: Date;
    end_datetime: Date;
    resources: { resource_name: string };
    user_name?: string;
}

interface Props {
    bookings: Booking[];
    renderRow: (booking: Booking) => React.ReactNode;
    headers: string[];
    showUserSearch?: boolean;
    themeColor?: "teal" | "green" | "indigo";
}

export default function BookingFilter({
    bookings,
    renderRow,
    headers,
    showUserSearch = false,
    themeColor = "indigo",
}: Props) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = bookings.filter((b) => {
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const searchLower = search.toLowerCase();
        const matchesSearch =
            b.resources.resource_name.toLowerCase().includes(searchLower) ||
            (b.user_name?.toLowerCase().includes(searchLower) ?? false);
        return matchesStatus && matchesSearch;
    });

    const headColors = {
        teal: "bg-teal-100",
        green: "bg-green-100",
        indigo: "bg-indigo-600 text-white",
    };

    return (
        <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by resource or user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded-lg text-black text-sm w-64 focus:outline-none focus:ring-2 focus:ring-offset-1"
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
                    <thead className={headColors[themeColor]}>
                        <tr>
                            {headers.map((h) => (
                                <th key={h} className="p-3 text-left border">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={headers.length} className="p-4 text-center text-gray-500">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                        {filtered.map((b) => renderRow(b))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}