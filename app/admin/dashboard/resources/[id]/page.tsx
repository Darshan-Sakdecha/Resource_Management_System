"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Edit2, ArrowLeft } from "lucide-react";

interface ResourceType {
  resource_type_id: number;
  type_name: string;
}

interface Building {
  building_id: number;
  building_name: string;
}

export default function EditResourcePage() {

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [form, setForm] = useState({
    resource_name: "",
    resource_type_id: "",
    building_id: "",
    floor_number: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  /* FETCH DATA */

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      try {

        /* Resource Types */
        const rtRes = await fetch("/api/resource-types");
        const rtData = await rtRes.json();
        const rtList = Array.isArray(rtData) ? rtData : rtData.data || [];
        setResourceTypes(rtList);

        /* Buildings */
        const bRes = await fetch("/api/buildings");
        const bData = await bRes.json();
        const bList = Array.isArray(bData) ? bData : bData.data || [];
        setBuildings(bList);

        /* Resource */
        const rRes = await fetch(`/api/resources/${id}`);
        const rData = await rRes.json();

        setForm({
          resource_name: rData.resource_name || "",
          resource_type_id: rData.resource_type_id?.toString() || "",
          building_id: rData.building_id?.toString() || "",
          floor_number: rData.floor_number?.toString() || "",
          description: rData.description ?? ""
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();

  }, [id]);

  /* HANDLE INPUT CHANGE */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  /* HANDLE SUBMIT */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);

    try {

      await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resource_name: form.resource_name,
          resource_type_id: Number(form.resource_type_id),
          building_id: Number(form.building_id),
          floor_number: Number(form.floor_number),
          description: form.description
        })
      });

      router.push("/admin/dashboard/resources");

    } catch (error) {

      console.error("Update failed:", error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border">

        {/* HEADER */}

        <div className="bg-indigo-600 text-white px-8 py-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Edit2 />
            <h2 className="text-lg font-semibold">Edit Resource</h2>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100"
          >
            <ArrowLeft size={16} />
            Back
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="p-10 space-y-6">

          {/* Resource Name */}

          <input
            type="text"
            name="resource_name"
            value={form.resource_name}
            onChange={handleChange}
            placeholder="Resource Name"
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* Resource Type */}

          <select
            name="resource_type_id"
            value={form.resource_type_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >

            <option value="">Select Resource Type</option>

            {resourceTypes.map((rt) => (
              <option
                key={rt.resource_type_id}
                value={rt.resource_type_id}
              >
                {rt.type_name}
              </option>
            ))}

          </select>

          {/* Building */}

          <select
            name="building_id"
            value={form.building_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >

            <option value="">Select Building</option>

            {buildings.map((b) => (
              <option
                key={b.building_id}
                value={b.building_id}
              >
                {b.building_name}
              </option>
            ))}

          </select>

          {/* Floor */}

          <input
            type="number"
            name="floor_number"
            value={form.floor_number}
            onChange={handleChange}
            placeholder="Floor Number"
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* Description */}

          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* BUTTONS */}

          <div className="flex justify-end gap-4">

            <Link
              href="/admin/dashboard/resources"
              className="border px-6 py-3 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700"
            >
              {loading ? "Updating..." : "Update Resource"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}