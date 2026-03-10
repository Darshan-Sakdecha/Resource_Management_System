"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export default function CreateBookingPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    resource_id: "",
    user_id: "",
    start_datetime: "",
    end_datetime: ""
  });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    await fetch("/api/bookings",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        resource_id:Number(form.resource_id),
        user_id:Number(form.user_id),
        start_datetime:form.start_datetime,
        end_datetime:form.end_datetime
      })
    });

    router.push("/admin/dashboard/bookings");
    router.refresh();
  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6">

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <span className="bg-indigo-100 p-2 rounded-xl">
            <CalendarPlus className="text-indigo-600"/>
          </span>

          <h2 className="text-2xl font-bold text-indigo-800">
            Create Booking
          </h2>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource ID
            </label>

            <input
              name="resource_id"
              placeholder="Enter Resource ID"
              value={form.resource_id}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>

            <input
              name="user_id"
              placeholder="Enter User ID"
              value={form.user_id}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>

            <input
              type="datetime-local"
              name="start_datetime"
              value={form.start_datetime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>

            <input
              type="datetime-local"
              name="end_datetime"
              value={form.end_datetime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">

            <Link
              href="/admin/dashboard/bookings"
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              Create Booking
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}