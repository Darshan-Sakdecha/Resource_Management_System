"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

interface Resource {
    resource_id: number;
    resource_name: string;
}

export default function EditFacilityPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [resources, setResources] = useState<Resource[]>([]);

    const [form, setForm] = useState({
        facility_name: "",
        details: "",
        resource_id: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchResources = async () => {
            const res = await fetch("/api/resources");
            const data = await res.json();

            const resourceList = Array.isArray(data) ? data : data.data || [];

            setResources(resourceList);
        };

        fetchResources();

    }, []);

    useEffect(() => {

        if (!id) return;

        const fetchFacility = async () => {

            const res = await fetch(`/api/facilities/${id}`);
            const data = await res.json();

            setForm({
                facility_name: data.facility_name,
                details: data.details ?? "",
                resource_id: data.resource_id.toString()
            });

        };

        fetchFacility();

    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setLoading(true);
        setError(null);

        try {

            const res = await fetch(`/api/facilities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    facility_name: form.facility_name,
                    details: form.details,
                    resource_id: Number(form.resource_id)
                })
            });

            if (!res.ok) throw new Error("Failed to update facility");

            router.push("/admin/dashboard/facilities");

        } catch (err: any) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center items-start">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100">

                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between text-white">

                    <div className="flex items-center gap-4">

                        <div className="bg-white/20 p-3 rounded-xl">
                            <Edit2 size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Edit Facility</h2>
                            <p className="text-sm text-indigo-100">Update facility details</p>
                        </div>

                    </div>

                    <Link
                        href="/admin/dashboard/facilities"
                        className="text-sm text-indigo-100 hover:text-white"
                    >
                        Back
                    </Link>

                </div>

                <div className="p-10 space-y-6">

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <input
                            type="text"
                            name="facility_name"
                            value={form.facility_name}
                            onChange={handleChange}
                            required
                            placeholder="Facility Name"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        <textarea
                            name="details"
                            value={form.details}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Facility details"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        {/* Resource Dropdown */}
                        <select
                            name="resource_id"
                            value={form.resource_id}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        >

                            <option value="">Select Resource</option>

                            {resources.map((r) => (
                                <option key={r.resource_id} value={r.resource_id}>
                                    {r.resource_name}
                                </option>
                            ))}

                        </select>

                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

                            <Link
                                href="/admin/dashboard/facilities"
                                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
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