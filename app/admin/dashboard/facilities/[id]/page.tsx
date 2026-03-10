"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

interface Facility {
    facility_id: number;
    facility_name: string;
    details: string | null;
    resource_id: number;
}

interface ApiError {
    error: string;
}

export default function EditFacilityPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [form, setForm] = useState({
        facility_name: "",
        details: "",
        resource_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch facility data
    useEffect(() => {
        if (!id) return;

        const fetchFacility = async () => {
            try {
                const res = await fetch(`/api/facilities/${id}`);
                const data: Facility | ApiError = await res.json();

                if ("error" in data) throw new Error(data.error);

                setForm({
                    facility_name: data.facility_name,
                    details: data.details ?? "",
                    resource_id: data.resource_id.toString(),
                });
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchFacility();
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
            const res = await fetch(`/api/facilities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    facility_name: form.facility_name,
                    details: form.details,
                    resource_id: Number(form.resource_id),
                }),
            });

            const data: Facility | ApiError = await res.json();

            if (!res.ok) {
                if ("error" in data) throw new Error(data.error);
                throw new Error("Failed to update facility");
            }

            router.push("/admin/dashboard/facilities");
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
                                Edit Facility
                            </h2>
                            <p className="text-sm text-indigo-100">
                                Update facility details
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/dashboard/facilities"
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

                        {/* Facility Name */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Facility Name
                            </label>
                            <input
                                type="text"
                                name="facility_name"
                                value={form.facility_name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Details */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Details
                            </label>
                            <textarea
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

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
                                min="1"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

                            <Link
                                href="/admin/dashboard/facilities"
                                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition font-medium"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading ? "Updating..." : "Update Facility"}
                            </button>

                        </div>

                    </form>
                </div>

            </div>

        </div>
    );
}