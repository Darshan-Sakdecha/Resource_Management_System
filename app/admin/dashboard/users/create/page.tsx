"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function CreateUserPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role_id: "", // store selected role id
    });

    const [roles, setRoles] = useState<{ role_id: number; role_name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch roles dynamically
    useEffect(() => {
        fetch("/api/roles")
            .then((res) => res.json())
            .then((data) => setRoles(data))
            .catch(() => setError("Failed to load roles"));
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role_id: Number(form.role_id),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create user");

            router.push("/admin/dashboard/users");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-10 border border-indigo-100">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                        <UserPlus size={28} className="text-indigo-600" />
                        Create User
                    </h2>
                    <Link
                        href="/admin/dashboard/users"
                        className="px-4 py-2 rounded-xl border border-indigo-300 text-black hover:bg-indigo-50"
                    >
                        ← Back
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />

                    {/* Dynamic Role Dropdown */}
                    <select
                        name="role_id"
                        value={form.role_id}
                        onChange={handleChange}
                        className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">
                        <Link
                            href="/admin/dashboard/users"
                            className="px-6 py-3 rounded-xl border border-indigo-300 text-black hover:bg-indigo-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}