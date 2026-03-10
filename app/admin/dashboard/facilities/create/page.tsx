"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function CreateFacilityPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        facility_name: "",
        details: "",
        resource_id: 1,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/facilities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    facility_name: form.facility_name,
                    details: form.details,
                    resource_id: Number(form.resource_id),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            router.push("/admin/dashboard/facilities");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">

            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <PlusCircle className="text-indigo-600" size={28} />
                        Create Facility
                    </h2>

                    <button
                        onClick={() => router.push("/admin/dashboard/facilities")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl transition"
                    >
                        ← Back
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Facility Name */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Facility Name
                        </label>
                        <input
                            type="text"
                            name="facility_name"
                            value={form.facility_name}
                            onChange={handleChange}
                            placeholder="Meeting Room"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Details
                        </label>
                        <textarea
                            name="details"
                            value={form.details}
                            onChange={handleChange}
                            placeholder="Projector, whiteboard, 10 seats"
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    {/* Resource ID */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Resource ID
                        </label>
                        <input
                            type="number"
                            name="resource_id"
                            value={form.resource_id}
                            onChange={handleChange}
                            min={1}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

                        <Link
                            href="/admin/dashboard/facilities"
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Facility"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}