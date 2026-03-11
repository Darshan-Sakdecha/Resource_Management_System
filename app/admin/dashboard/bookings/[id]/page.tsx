"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Resource {
  resource_id: number;
  resource_name: string;
}

interface User {
  user_id: number;
  name: string;
}

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    resource_id: "",
    user_id: "",
    start_datetime: "",
    end_datetime: "",
    status: "pending",
  });

  const statusOptions = ["pending", "approved", "rejected"];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resResources, resUsers, resBooking] = await Promise.all([
        fetch("/api/resources"),
        fetch("/api/users"),
        fetch(`/api/bookings/${id}`),
      ]);

      const resourcesData = await resResources.json();
      const usersData = await resUsers.json();
      const booking = await resBooking.json();

      setResources(resourcesData.data || resourcesData);
      setUsers(usersData.data || usersData);

      setForm({
        resource_id: booking.resource_id.toString(),
        user_id: booking.user_id.toString(),
        start_datetime: booking.start_datetime.slice(0, 16),
        end_datetime: booking.end_datetime.slice(0, 16),
        status: booking.status,
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: Number(form.resource_id),
          user_id: Number(form.user_id),
          start_datetime: form.start_datetime,
          end_datetime: form.end_datetime,
          status: form.status,
        }),
      });

      router.push("/admin/dashboard/bookings");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border">
        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-8 py-6">
          <h2 className="text-lg font-semibold">Edit Booking</h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* RESOURCE */}
          <select
            name="resource_id"
            value={form.resource_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >
            <option value="">Select Resource</option>
            {resources.map((r) => (
              <option key={r.resource_id} value={r.resource_id}>
                {r.resource_name}
              </option>
            ))}
          </select>

          {/* USER */}
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* START */}
          <input
            type="datetime-local"
            name="start_datetime"
            value={form.start_datetime}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* END */}
          <input
            type="datetime-local"
            name="end_datetime"
            value={form.end_datetime}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          {/* STATUS */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="border px-6 py-3 rounded-xl text-black hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}