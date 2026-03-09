"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Building {
  building_id: number;
  building_name: string;
}

interface ResourceType {
  resource_type_id: number;
  type_name: string;
}

export default function AddResourcePage() {
  const router = useRouter();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [form, setForm] = useState({
    resource_name: "",
    building_id: 0,
    resource_type_id: 0,
    floor_number: 1,
    description: "",
  });

  const fetchOptions = async () => {
    const [bRes, tRes] = await Promise.all([
      fetch("/api/buildings").then((res) => res.json()),
      fetch("/api/resource-types").then((res) => res.json()),
    ]);
    setBuildings(bRes.data || []);
    setTypes(tRes.data || []);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add resource");
      router.push("/admin/dashboard/resources");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Back button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add Resource</h2>
          <button
            onClick={() => router.push("/admin/dashboard/resources")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl transition"
          >
            ← Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 space-y-5"
        >
          {/* Resource Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Resource Name
            </label>
            <input
              type="text"
              name="resource_name"
              value={form.resource_name}
              onChange={handleChange}
              placeholder="Enter resource name"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Building */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Building</label>
            <select
              name="building_id"
              value={form.building_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value={0}>Select Building</option>
              {buildings.map((b) => (
                <option key={b.building_id} value={b.building_id}>
                  {b.building_name}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              name="resource_type_id"
              value={form.resource_type_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value={0}>Select Type</option>
              {types.map((t) => (
                <option key={t.resource_type_id} value={t.resource_type_id}>
                  {t.type_name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Number */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Floor Number</label>
            <input
              type="number"
              name="floor_number"
              value={form.floor_number}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description (optional)"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}
