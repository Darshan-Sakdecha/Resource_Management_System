"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface Building {
  building_id: number;
  building_name: string;
}

interface ResourceType {
  resource_type_id: number;
  type_name: string;
}

interface Resource {
  resource_id: number;
  resource_name: string;
  building_id: number;
  resource_type_id: number;
  floor_number: number;
  description: string;
}

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params.id;

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [form, setForm] = useState<Resource | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [resRes, bRes, tRes] = await Promise.all([
        fetch(`/api/resources/${resourceId}`).then((res) => res.json()),
        fetch("/api/buildings").then((res) => res.json()),
        fetch("/api/resource-types").then((res) => res.json()),
      ]);

      setForm(resRes);
      setBuildings(bRes.data || []);
      setTypes(tRes.data || []);
    };
    fetchData();
  }, [resourceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      const res = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update resource");
      router.push("/admin/dashboard/resources");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-indigo-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Edit Resource</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div>
          <label className="block font-medium">Resource Name</label>
          <input
            type="text"
            name="resource_name"
            value={form.resource_name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Building</label>
          <select
            name="building_id"
            value={form.building_id}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          >
            {buildings.map((b) => (
              <option key={b.building_id} value={b.building_id}>{b.building_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Resource Type</label>
          <select
            name="resource_type_id"
            value={form.resource_type_id}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          >
            {types.map((t) => (
              <option key={t.resource_type_id} value={t.resource_type_id}>{t.type_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Floor Number</label>
          <input
            type="number"
            name="floor_number"
            value={form.floor_number}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Update Resource
        </button>
      </form>
    </div>
  );
}
