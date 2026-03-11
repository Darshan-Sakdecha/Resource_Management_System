"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditRolePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch role data
    useEffect(() => {
        if (!id) return;

        const fetchRole = async () => {
            try {
                const res = await fetch(`/api/roles/${id}`);
                if (!res.ok) throw new Error("Failed to fetch role");

                const data = await res.json();
                setRoleName(data.role_name);
            } catch (err: any) {
                setError(err.message || "Failed to load role");
            }
        };

        fetchRole();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/roles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_name: roleName }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update role");

            router.push("/admin/dashboard/roles");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Edit2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Edit Role</h2>
                            <p className="text-sm text-white/70">Update role name</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/dashboard/roles"
                        className="text-sm text-indigo-100 hover:text-white"
                    >
                        Back
                    </Link>
                </div>

                {/* FORM */}
                <div className="p-10">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <input
                            type="text"
                            name="role_name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Role Name"
                            className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />

                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">
                            <Link
                                href="/admin/dashboard/roles"
                                className="px-6 py-3 rounded-xl border border-indigo-300 text-black hover:bg-indigo-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                {loading ? "Updating..." : "Update Role"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}