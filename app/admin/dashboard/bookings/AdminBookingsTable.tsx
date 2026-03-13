"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2 } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

interface Booking {
    booking_id: number;
    status: string;
    start_datetime: string;
    end_datetime: string;
    user_name: string;
    resources: { resource_name: string };
}

interface Props {
    bookings: Booking[];
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case "approved": return "bg-green-100 text-green-700";
        case "rejected": return "bg-red-100 text-red-700";
        default: return "bg-yellow-100 text-yellow-700";
    }
};

export default function AdminBookingsTable({ bookings }: Props) {
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
                    className="border p-2 rounded-lg text-black text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            {filtered.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No bookings found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="p-4 text-left font-medium">ID</th>
                                <th className="p-4 text-left font-medium">User</th>
                                <th className="p-4 text-left font-medium">Resource</th>
                                <th className="p-4 text-left font-medium">Start</th>
                                <th className="p-4 text-left font-medium">End</th>
                                <th className="p-4 text-left font-medium">Status</th>
                                <th className="p-4 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b) => (
                                <tr key={b.booking_id} className="border-t hover:bg-indigo-50/30 transition">
                                    <td className="p-4 text-black">{b.booking_id}</td>
                                    <td className="p-4 text-black">{b.user_name}</td>
                                    <td className="p-4 text-black">{b.resources.resource_name}</td>
                                    <td className="p-4 text-black">{new Date(b.start_datetime).toLocaleString()}</td>
                                    <td className="p-4 text-black">{new Date(b.end_datetime).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(b.status)}`}>
                                            {b.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/dashboard/bookings/${b.booking_id}`}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition"
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </Link>
                                            <DeleteButton
                                                id={b.booking_id}
                                                name="Booking"
                                                apiPath="bookings"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}