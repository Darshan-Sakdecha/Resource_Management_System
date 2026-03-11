"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes } from "lucide-react";

export default function CreateCupboardPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        resource_id: "",
        cupboard_name: "",
        total_shelves: "",
    });

    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/resources")
            .then(res => res.json())
            .then(data => {
                const arr = Array.isArray(data) ? data : data.data ?? [];
                setResources(arr);
            })
            .catch(() => setResources([]));
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/cupboards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resource_id: Number(form.resource_id),
                    cupboard_name: form.cupboard_name,
                    total_shelves: Number(form.total_shelves),
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            router.push("/admin/dashboard/cupboards");

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
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white flex items-center gap-3">
                    <Boxes size={24} />
                    <h2 className="text-xl font-semibold">Create Cupboard</h2>
                </div>

                <div className="p-10 space-y-6">

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Resource */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Resource
                            </label>

                            <select
                                name="resource_id"
                                value={form.resource_id}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Resource</option>

                                {resources.map((r) => (
                                    <option key={r.resource_id} value={r.resource_id}>
                                        {r.resource_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cupboard Name */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Cupboard Name
                            </label>

                            <input
                                type="text"
                                name="cupboard_name"
                                value={form.cupboard_name}
                                onChange={handleChange}
                                placeholder="Enter cupboard name (e.g., Storage Cupboard A)"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Total Shelves */}
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2">
                                Total Shelves
                            </label>

                            <input
                                type="number"
                                name="total_shelves"
                                value={form.total_shelves}
                                onChange={handleChange}
                                placeholder="Enter total shelves (e.g., 10)"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

                            <Link
                                href="/admin/dashboard/cupboards"
                                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Cupboard"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}