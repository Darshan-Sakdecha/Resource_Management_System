"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function CreateResourceTypePage() {

  const router = useRouter();

  const [form, setForm] = useState({
    type_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {

      const res = await fetch("/api/resource-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type_name: form.type_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/admin/dashboard/resource-types");

    } catch (err:any) {
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
          <Layers size={24}/>
          <h2 className="text-xl font-semibold">
            Create Resource Type
          </h2>
        </div>

        <div className="p-10 space-y-6">

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Type Name */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Type Name
              </label>

              <input
                type="text"
                name="type_name"
                value={form.type_name}
                onChange={handleChange}
                placeholder="Enter resource type (e.g., Meeting Room, Lab, Storage)"
                required
                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

              <Link
                href="/admin/dashboard/resource-types"
                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Type"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}