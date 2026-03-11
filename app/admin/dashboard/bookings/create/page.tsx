"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBookingPage() {

  const router = useRouter();

  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    resource_id: "",
    user_id: "",
    start_datetime: "",
    end_datetime: ""
  });

  useEffect(() => {

    const fetchData = async () => {

      const r = await fetch("/api/resources");
      const u = await fetch("/api/users");

      const rData = await r.json();
      const uData = await u.json();

      setResources(rData.data || []);
      setUsers(uData.data || []);

    };

    fetchData();

  }, []);

  const handleChange = (e: any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resource_id: Number(form.resource_id),
        user_id: Number(form.user_id),
        start_datetime: form.start_datetime,
        end_datetime: form.end_datetime
      })
    });

    router.push("/admin/dashboard/bookings");
    router.refresh();

  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center text-black">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border p-10">

        <h2 className="text-xl font-bold mb-6 text-black">
          Create Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <select
            name="resource_id"
            value={form.resource_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >

            <option value="">Select Resource</option>

            {resources.map((r: any) => (
              <option key={r.resource_id} value={r.resource_id}>
                {r.resource_name}
              </option>
            ))}

          </select>

          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          >

            <option value="">Select User</option>

            {users.map((u: any) => (
              <option key={u.user_id} value={u.user_id}>
                {u.name}
              </option>
            ))}

          </select>

          <input
            type="datetime-local"
            name="start_datetime"
            value={form.start_datetime}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          <input
            type="datetime-local"
            name="end_datetime"
            value={form.end_datetime}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-3 text-black"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
          >
            Create Booking
          </button>

        </form>

      </div>

    </div>

  );
}