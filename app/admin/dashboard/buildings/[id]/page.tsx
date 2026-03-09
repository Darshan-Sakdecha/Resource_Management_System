"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

interface Building {
  building_id: number;
  building_name: string;
  building_number: string;
  total_floors: number;
}

interface ApiError {
  error: string;
}

export default function EditBuildingPage() {
  const router = useRouter();
  const params = useParams(); // dynamic route [id]/page.tsx
  const id = params?.id;

  const [form, setForm] = useState({
    building_name: "",
    building_number: "",
    total_floors: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch building data
  useEffect(() => {
    if (!id) return;

    const fetchBuilding = async () => {
      try {
        const res = await fetch(`/api/buildings/${id}`);
        const data: Building | ApiError = await res.json();

        // Check for API error
        if ("error" in data) throw new Error(data.error);

        setForm({
          building_name: data.building_name,
          building_number: data.building_number,
          total_floors: data.total_floors.toString(),
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBuilding();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/buildings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          building_name: form.building_name,
          building_number: form.building_number,
          total_floors: Number(form.total_floors),
        }),
      });

      const data: Building | ApiError = await res.json();

      if (!res.ok) {
        if ("error" in data) throw new Error(data.error);
        throw new Error("Failed to update building");
      }

      router.push("/admin/dashboard/buildings");
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
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-wide">Edit Building</h2>
              <p className="text-sm text-indigo-100">Update building details</p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/buildings"
            className="text-sm text-indigo-100 hover:text-white transition"
          >
            Back
          </Link>
        </div>

        {/* FORM */}
        <div className="p-10 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Building Name
              </label>
              <input
                type="text"
                name="building_name"
                value={form.building_name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Building Number
              </label>
              <input
                type="text"
                name="building_number"
                value={form.building_number}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Total Floors
              </label>
              <input
                type="number"
                name="total_floors"
                value={form.total_floors}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">
              <Link
                href="/admin/dashboard/buildings"
                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Updating..." : "Update Building"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
