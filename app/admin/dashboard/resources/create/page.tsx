"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes } from "lucide-react";

interface ResourceType {
  resource_type_id: number;
  type_name: string;
}

interface Building {
  building_id: number;
  building_name: string;
}

export default function CreateResourcePage() {

  const router = useRouter();

  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [form, setForm] = useState({
    resource_name: "",
    resource_type_id: "",
    building_id: "",
    floor_number: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* FETCH DROPDOWN DATA */

  useEffect(() => {

    const fetchDropdowns = async () => {

      try {

        const typeRes = await fetch("/api/resource-types");
        const typeData = await typeRes.json();

        const buildingRes = await fetch("/api/buildings");
        const buildingData = await buildingRes.json();

        setResourceTypes(
          Array.isArray(typeData) ? typeData : typeData.data || []
        );

        setBuildings(
          Array.isArray(buildingData) ? buildingData : buildingData.data || []
        );

      } catch {
        setError("Failed to load dropdown data");
      }

    };

    fetchDropdowns();

  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch("/api/resources", {
        method: "POST",
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

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border">

        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-8 py-6 flex justify-between">

          <h2 className="flex items-center gap-3">
            <Boxes size={24} />
            Create Resource
          </h2>

          <Link href="/admin/dashboard/resources">
            Back
          </Link>

        </div>

        {/* FORM */}
        <div className="p-10 space-y-6">

          {error && (
            <div className="text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* RESOURCE NAME */}
            <input
              name="resource_name"
              value={form.resource_name}
              onChange={handleChange}
              placeholder="Resource Name"
              className="w-full border rounded-xl px-5 py-3 text-black"
            />

            {/* RESOURCE TYPE DROPDOWN */}
            <select
              name="resource_type_id"
              value={form.resource_type_id}
              onChange={handleChange}
              className="w-full border rounded-xl px-5 py-3 text-black"
            >

              <option value="">Select Resource Type</option>

              {resourceTypes.map((rt) => (
                <option key={rt.resource_type_id} value={rt.resource_type_id}>
                  {rt.type_name}
                </option>
              ))}

            </select>

            {/* BUILDING DROPDOWN */}
            <select
              name="building_id"
              value={form.building_id}
              onChange={handleChange}
              className="w-full border rounded-xl px-5 py-3 text-black"
            >

              <option value="">Select Building</option>

              {buildings.map((b) => (
                <option key={b.building_id} value={b.building_id}>
                  {b.building_name}
                </option>
              ))}

            </select>

            {/* FLOOR */}
            <input
              name="floor_number"
              value={form.floor_number}
              onChange={handleChange}
              placeholder="Floor Number"
              className="w-full border rounded-xl px-5 py-3 text-black"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded-xl px-5 py-3 text-black"
            />

            <div className="flex justify-end gap-4">

              <Link
                href="/admin/dashboard/resources"
                className="border px-6 py-3 rounded-xl"
              >
                Cancel
              </Link>

              <button
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
              >
                {loading ? "Creating..." : "Create Resource"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}