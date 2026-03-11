"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Resource {
  resource_id: number;
  resource_name: string;
}

interface User {
  user_id: number;
  name: string;
}

const STATUS_OPTIONS = ["pending", "approved", "rejected"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    resource_id: "",
    user_id: "",
    start_datetime: "",
    end_datetime: "",
    status: "pending" as Status,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [resR, resU, resB] = await Promise.all([
          fetch("/api/resources"),
          fetch("/api/users"),
          fetch(`/api/bookings/${id}`),
        ]);

        if (!resB.ok) throw new Error("Booking not found");

        const rData = await resR.json();
        const uData = await resU.json();
        const bData = await resB.json();

        setResources(rData.data || []);
        setUsers(uData.data || []);
        setForm({
          resource_id: bData.resource_id.toString(),
          user_id: bData.user_id.toString(),
          start_datetime: bData.start_datetime.slice(0, 16),
          end_datetime: bData.end_datetime.slice(0, 16),
          status: bData.status,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load booking data.");
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (new Date(form.start_datetime) >= new Date(form.end_datetime)) {
      setError("Start date/time must be before end date/time.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: Number(form.resource_id),
          user_id: Number(form.user_id),
          start_datetime: new Date(form.start_datetime).toISOString(),
          end_datetime: new Date(form.end_datetime).toISOString(),
          status: form.status,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to update booking");
      }

      setSuccess("Booking updated successfully! Redirecting...");
      setTimeout(() => router.push("/admin/dashboard/bookings"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50/40">
        <p className="text-black">Loading booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50/40 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/dashboard/bookings"
            className="p-2 rounded-xl hover:bg-white transition text-black"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
              <CalendarCheck size={22} />
              Edit Booking #{id}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update the booking details below
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border p-10">
          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Resource */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">
                Resource <span className="text-red-500">*</span>
              </label>
              <select
                name="resource_id"
                value={form.resource_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                required
              >
                <option value="" className="text-black">Select Resource</option>
                {resources.map((r) => (
                  <option key={r.resource_id} value={r.resource_id} className="text-black">
                    {r.resource_name}
                  </option>
                ))}
              </select>
            </div>

            {/* User */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">
                User <span className="text-red-500">*</span>
              </label>
              <select
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                required
              >
                <option value="" className="text-black">Select User</option>
                {users.map((u) => (
                  <option key={u.user_id} value={u.user_id} className="text-black">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start DateTime */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_datetime"
                value={form.start_datetime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* End DateTime */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_datetime"
                value={form.end_datetime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-black">
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
              >
                {loading ? "Updating..." : "Update Booking"}
              </button>
              <Link
                href="/admin/dashboard/bookings"
                className="px-6 py-3 rounded-xl border border-gray-200 text-black hover:bg-gray-50 transition text-center font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}