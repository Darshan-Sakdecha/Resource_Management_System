"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [form, setForm] = useState({
        name: "",
        email: "",
        role_id: ""
    });
    const [roles, setRoles] = useState<{ role_id: number; role_name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/roles")
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(() => setError("Failed to load roles"));
    }, []);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    name: data.name,
                    email: data.email,
                    role_id: data.role_id.toString()
                });
            })
            .catch(() => setError("Failed to load user"));
    }, [id]);

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    role_id: Number(form.role_id)
                })
            });
            if (!res.ok) throw new Error("Failed to update user");
            router.push("/admin/dashboard/users");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Edit2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Edit User</h2>
                            <p className="text-sm text-white/70">Update user details</p>
                        </div>
                    </div>

                    <Link href="/admin/dashboard/users" className="text-sm text-indigo-100 hover:text-white">
                        Back
                    </Link>
                </div>

                <div className="p-10">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            type="email"
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        />

                        <select
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black"
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">
                            <Link
                                href="/admin/dashboard/users"
                                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                {loading ? "Updating..." : "Update User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}