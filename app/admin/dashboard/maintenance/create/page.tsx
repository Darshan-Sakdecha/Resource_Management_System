"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

interface Resource {
  resource_id: number;
  resource_name: string;
}

export default function CreateMaintenancePage() {

  const router = useRouter();

  const [resources, setResources] = useState<Resource[]>([]);

  const [form, setForm] = useState({
    resource_id: "",
    maintenance_type: "",
    scheduled_date: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {

    const fetchResources = async () => {

      const res = await fetch("/api/resources");
      const data = await res.json();

      const list = Array.isArray(data) ? data : data.data || [];

      setResources(list);

    };

    fetchResources();

  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    await fetch("/api/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resource_id: Number(form.resource_id),
        maintenance_type: form.maintenance_type,
        scheduled_date: form.scheduled_date,
        status: form.status,
        notes: form.notes,
      }),
    });

    router.push("/admin/dashboard/maintenance");

  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border">

        {/* HEADER */}

        <div className="bg-indigo-600 text-white px-8 py-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Wrench />
            <h2 className="text-lg font-semibold">Create Maintenance</h2>
          </div>

          {/* BACK BUTTON */}

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

          <select
            name="resource_id"
            value={form.resource_id}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-5 py-3 text-black"
          >
            <option value="">Select Resource</option>

            {resources.map((r) => (
              <option key={r.resource_id} value={r.resource_id}>
                {r.resource_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="maintenance_type"
            value={form.maintenance_type}
            onChange={handleChange}
            placeholder="Maintenance Type"
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          <input
            type="date"
            name="scheduled_date"
            value={form.scheduled_date}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* STATUS DROPDOWN */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <textarea
            name="notes"
            rows={4}
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Create Maintenance
          </button>

        </form>

      </div>

    </div>

  );

}