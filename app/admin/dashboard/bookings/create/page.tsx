"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateBookingPage() {
  const router = useRouter();

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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, uRes] = await Promise.all([
          fetch("/api/resources"),
          fetch("/api/users"),
        ]);
        const rData = await rRes.json();
        const uData = await uRes.json();
        setResources(rData.data || []);
        setUsers(uData.data || []);
      } catch (err) {
        console.error("Failed to load form data:", err);
        setError("Failed to load form data. Please refresh.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

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

    if (!form.resource_id || !form.user_id) {
      setError("Please select a resource and a user.");
      setLoading(false);
      return;
    }

    if (new Date(form.start_datetime) >= new Date(form.end_datetime)) {
      setError("Start date/time must be before end date/time.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: Number(form.resource_id),
          user_id: Number(form.user_id),
          start_datetime: new Date(form.start_datetime).toISOString(),
          end_datetime: new Date(form.end_datetime).toISOString(),
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to create booking");
      }

      setSuccess("Booking created successfully! Redirecting...");
      setTimeout(() => router.push("/admin/dashboard/bookings"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              Create Booking
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in the details to create a new booking
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

          {fetching ? (
            <div className="py-10 text-center text-gray-400">
              Loading form data...
            </div>
          ) : (
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

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? "Creating..." : "Create Booking"}
                </button>
                <Link
                  href="/admin/dashboard/bookings"
                  className="px-6 py-3 rounded-xl border border-gray-200 text-black hover:bg-gray-50 transition text-center font-medium"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}