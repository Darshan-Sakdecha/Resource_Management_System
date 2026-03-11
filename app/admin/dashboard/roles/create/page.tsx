"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function CreateRolePage() {
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_name: roleName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create role");

      router.push("/admin/dashboard/roles");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/40 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl border border-indigo-100 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <PlusCircle className="text-indigo-600" size={28} />
            Create Role
          </h2>

          <button
            onClick={() => router.push("/admin/dashboard/roles")}
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-xl"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
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
              {loading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}