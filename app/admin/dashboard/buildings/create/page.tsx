"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function CreateBuildingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    building_name: "",
    building_number: "",
    total_floors: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          building_name: form.building_name,
          building_number: form.building_number,
          total_floors: Number(form.total_floors),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/dashboard/buildings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">

        {/* Header with Back button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-indigo-600" size={28} />
            Create Building
          </h2>
          <button
            onClick={() => router.push("/admin/dashboard/buildings")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl transition"
          >
            ← Back
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Building Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Building Name
            </label>
            <input
              type="text"
              name="building_name"
              value={form.building_name}
              onChange={handleChange}
              placeholder="Corporate Tower"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Building Number */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Building Number
            </label>
            <input
              type="text"
              name="building_number"
              value={form.building_number}
              onChange={handleChange}
              placeholder="B-101"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Total Floors */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Total Floors
            </label>
            <input
              type="number"
              name="total_floors"
              value={form.total_floors}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Link
              href="/admin/dashboard/buildings"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Building"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
