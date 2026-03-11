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
    total_floors: ""
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          building_name: form.building_name,
          building_number: form.building_number,
          total_floors: Number(form.total_floors)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create building");
      }

      router.push("/admin/dashboard/buildings");

    } catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/40 p-8 flex items-center justify-center">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl border border-indigo-100 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <Building2 className="text-indigo-600" size={28} />
            Create Building
          </h2>

          <button
            onClick={() => router.push("/admin/dashboard/buildings")}
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-xl"
          >
            ← Back
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            name="building_name"
            placeholder="Enter Building Name"
            value={form.building_name}
            onChange={handleChange}
            required
            className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="building_number"
            placeholder="Enter Building Number"
            value={form.building_number}
            onChange={handleChange}
            required
            className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="number"
            name="total_floors"
            placeholder="Enter Total Floors"
            value={form.total_floors}
            onChange={handleChange}
            required
            className="w-full border border-indigo-300 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

            <Link
              href="/admin/dashboard/buildings"
              className="px-6 py-3 rounded-xl border border-indigo-300 text-black hover:bg-indigo-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Building"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}