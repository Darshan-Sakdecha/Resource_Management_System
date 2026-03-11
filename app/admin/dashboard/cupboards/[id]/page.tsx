"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditCupboardPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [form, setForm] = useState({
        resource_id: "",
        cupboard_name: "",
        total_shelves: "",
    });

    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        fetch(`/api/cupboards/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    resource_id: data.resource_id,
                    cupboard_name: data.cupboard_name,
                    total_shelves: data.total_shelves,
                });
            });

        fetch("/api/resources")
            .then(res => res.json())
            .then(data => {
                const arr = Array.isArray(data) ? data : data.data ?? [];
                setResources(arr);
            });

    }, [id]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        try {

            const res = await fetch(`/api/cupboards/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resource_id: Number(form.resource_id),
                    cupboard_name: form.cupboard_name,
                    total_shelves: Number(form.total_shelves),
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            router.push("/admin/dashboard/cupboards");

        } catch (err: any) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center items-start">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white flex justify-between">

                    <div className="flex items-center gap-3">
                        <Edit2 size={24} />
                        <h2 className="text-xl font-semibold">
                            Edit Cupboard
                        </h2>
                    </div>

                    <Link
                        href="/admin/dashboard/cupboards"
                        className="text-indigo-100 hover:text-white"
                    >
                        Back
                    </Link>

                </div>

                <div className="p-10 space-y-6">

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Resource */}
                        <select
                            name="resource_id"
                            value={form.resource_id}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        >
                            <option value="">Select Resource</option>

                            {resources.map((r) => (
                                <option key={r.resource_id} value={r.resource_id}>
                                    {r.resource_name}
                                </option>
                            ))}
                        </select>

                        {/* Name */}
                        <input
                            name="cupboard_name"
                            value={form.cupboard_name}
                            onChange={handleChange}
                            placeholder="Cupboard Name"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        {/* Shelves */}
                        <input
                            name="total_shelves"
                            value={form.total_shelves}
                            onChange={handleChange}
                            placeholder="Total Shelves"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        <div className="flex justify-end gap-4">

                            <Link
                                href="/admin/dashboard/cupboards"
                                className="px-6 py-3 border border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                            >
                                {loading ? "Updating..." : "Update Cupboard"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}