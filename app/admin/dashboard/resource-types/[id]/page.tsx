"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditResourceTypePage() {

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState({
    type_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    fetch(`/api/resource-types/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          type_name: data.type_name,
        });
      })
      .catch(() => setError("Failed to fetch resource type"));

  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(`/api/resource-types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type_name: form.type_name,
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/admin/dashboard/resource-types");

    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center items-start">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white flex justify-between">

          <div className="flex items-center gap-3">
            <Edit2 size={24} />
            <h2 className="text-xl font-semibold">
              Edit Resource Type
            </h2>
          </div>

          <Link
            href="/admin/dashboard/resource-types"
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

            <input
              name="type_name"
              value={form.type_name}
              onChange={handleChange}
              placeholder="Type Name"
              className="w-full px-5 py-3 rounded-xl border border-indigo-200 text-black focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-4">

              <Link
                href="/admin/dashboard/resource-types"
                className="px-6 py-3 border border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                {loading ? "Updating..." : "Update Type"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}