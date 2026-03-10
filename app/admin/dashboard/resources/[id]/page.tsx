"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditResourcePage() {

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState<any>({
    resource_name: "",
    resource_type_id: "",
    building_id: "",
    floor_number: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!id) return;

    fetch(`/api/resources/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          resource_name: data.resource_name,
          resource_type_id: data.resource_type_id,
          building_id: data.building_id,
          floor_number: data.floor_number,
          description: data.description ?? ""
        })
      });

  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_name: form.resource_name,
          resource_type_id: Number(form.resource_type_id),
          building_id: Number(form.building_id),
          floor_number: Number(form.floor_number),
          description: form.description
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/admin/dashboard/resources");

    } catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center items-start">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white flex justify-between">

          <div className="flex items-center gap-3">
            <Edit2 size={24} />
            <h2 className="text-xl font-semibold">Edit Resource</h2>
          </div>

          <Link
            href="/admin/dashboard/resources"
            className="text-indigo-100 hover:text-white"
          >
            Back
          </Link>

        </div>

        <div className="p-10 space-y-6">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Resource Name */}
            <input
              name="resource_name"
              value={form.resource_name}
              onChange={handleChange}
              placeholder="Resource Name"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Resource Type */}
            <input
              name="resource_type_id"
              value={form.resource_type_id}
              onChange={handleChange}
              placeholder="Resource Type ID"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Building ID */}
            <input
              name="building_id"
              value={form.building_id}
              onChange={handleChange}
              placeholder="Building ID"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Floor Number */}
            <input
              name="floor_number"
              value={form.floor_number}
              onChange={handleChange}
              placeholder="Floor Number"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="flex justify-end gap-4">

              <Link
                href="/admin/dashboard/resources"
                className="px-6 py-3 border border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                {loading ? "Updating..." : "Update Resource"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}