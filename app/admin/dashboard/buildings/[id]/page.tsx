"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditBuildingPage() {

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState({
    building_name: "",
    building_number: "",
    total_floors: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!id) return;

    const fetchBuilding = async () => {
      try {

        const res = await fetch(`/api/buildings/${id}`);
        const data = await res.json();

        setForm({
          building_name: data.building_name || "",
          building_number: data.building_number || "",
          total_floors: data.total_floors?.toString() || ""
        });

      } catch (err) {
        setError("Failed to load building");
      }
    };

    fetchBuilding();

  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const res = await fetch(`/api/buildings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          building_name: form.building_name,
          building_number: form.building_number,
          total_floors: Number(form.total_floors)
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update building");
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
    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between text-white">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-3 rounded-xl">
              <Edit2 size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Edit Building</h2>
              <p className="text-sm text-white/70">Update building details</p>
            </div>

          </div>

          <Link
            href="/admin/dashboard/buildings"
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
              name="building_name"
              value={form.building_name}
              onChange={handleChange}
              placeholder="Enter Building Name"
              required
              className="w-full px-5 py-3 rounded-xl border border-indigo-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="building_number"
              value={form.building_number}
              onChange={handleChange}
              placeholder="Enter Building Number"
              required
              className="w-full px-5 py-3 rounded-xl border border-indigo-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="number"
              name="total_floors"
              value={form.total_floors}
              onChange={handleChange}
              placeholder="Enter Total Floors"
              required
              className="w-full px-5 py-3 rounded-xl border border-indigo-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
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