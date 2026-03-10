"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

interface Maintenance {
    maintenance_id: number;
    resource_id: number;
    maintenance_type: string;
    scheduled_date: string | null;
    status: string;
    notes: string | null;
}

interface ApiError {
    error: string;
}

export default function EditMaintenancePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [form, setForm] = useState({
        resource_id: "",
        maintenance_type: "",
        scheduled_date: "",
        status: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch maintenance data
    useEffect(() => {
        if (!id) return;

        const fetchMaintenance = async () => {
            try {
                const res = await fetch(`/api/maintenance/${id}`);
                const data: Maintenance | ApiError = await res.json();

                if ("error" in data) throw new Error(data.error);

                setForm({
                    resource_id: data.resource_id.toString(),
                    maintenance_type: data.maintenance_type,
                    scheduled_date: data.scheduled_date?.substring(0, 10) || "",
                    status: data.status,
                    notes: data.notes ?? "",
                });
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchMaintenance();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/maintenance/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resource_id: Number(form.resource_id),
                    maintenance_type: form.maintenance_type,
                    scheduled_date: form.scheduled_date,
                    status: form.status,
                    notes: form.notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update maintenance");
            }

            router.push("/admin/dashboard/maintenance");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center items-start">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex items-center justify-between text-white">

                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Edit2 size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold tracking-wide">
                                Edit Maintenance
                            </h2>
                            <p className="text-sm text-indigo-100">
                                Update maintenance details
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/dashboard/maintenance"
                        className="text-sm text-indigo-100 hover:text-white transition"
                    >
                        Back
                    </Link>

                </div>

                {/* FORM */}
                <div className="p-10 space-y-6">

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Resource ID */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Resource ID
                            </label>
                            <input
                                type="number"
                                name="resource_id"
                                value={form.resource_id}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Maintenance Type */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Maintenance Type
                            </label>
                            <input
                                type="text"
                                name="maintenance_type"
                                value={form.maintenance_type}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Scheduled Date */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Scheduled Date
                            </label>
                            <input
                                type="date"
                                name="scheduled_date"
                                value={form.scheduled_date}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Status
                            </label>
                            <input
                                type="text"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                rows={4}
                                value={form.notes}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

                            <Link
                                href="/admin/dashboard/maintenance"
                                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition font-medium"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading ? "Updating..." : "Update Maintenance"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}