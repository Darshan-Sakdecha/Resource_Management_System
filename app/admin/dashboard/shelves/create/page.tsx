"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes } from "lucide-react";

export default function CreateShelfPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    cupboard_id: "",
    shelf_number: "",
    capacity: "",
    description: "",
  });

  const [cupboards, setCupboards] = useState<{ cupboard_id: number; cupboard_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cupboards dynamically
  useEffect(() => {
    fetch("/api/cupboards")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data ?? [];
        setCupboards(list);
      })
      .catch(() => setCupboards([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shelves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cupboard_id: Number(form.cupboard_id),
          shelf_number: Number(form.shelf_number), // ✅ convert to number
          capacity: Number(form.capacity),
          description: form.description,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create shelf");

      router.push("/admin/dashboard/shelves");
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
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white flex items-center gap-3">
          <Boxes size={24} />
          <h2 className="text-xl font-semibold">Create Shelf</h2>
        </div>

        <div className="p-10 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cupboard Dropdown */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">Cupboard</label>
              <select
                name="cupboard_id"
                value={form.cupboard_id}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Cupboard</option>
                {cupboards.map((c) => (
                  <option key={c.cupboard_id} value={c.cupboard_id}>
                    {c.cupboard_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shelf Number */}
            <input
              type="text"
              name="shelf_number"
              placeholder="Shelf Number"
              value={form.shelf_number}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Capacity */}
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />

            <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">
              <Link
                href="/admin/dashboard/shelves"
                className="px-6 py-3 border border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                {loading ? "Creating..." : "Create Shelf"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}