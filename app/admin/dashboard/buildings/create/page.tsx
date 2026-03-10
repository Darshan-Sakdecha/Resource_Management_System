"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function CreateBookingPage() {

  const router = useRouter();

  const [form,setForm] = useState({
    user_id:"",
    resource_id:"",
    start_datetime:"",
    end_datetime:"",
    status:"scheduled"
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  const handleChange = (e:any)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async(e:any)=>{
    e.preventDefault();
    setLoading(true);

    try{

      const res = await fetch("/api/bookings",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({
          user_id:Number(form.user_id),
          resource_id:Number(form.resource_id),
          start_datetime:form.start_datetime,
          end_datetime:form.end_datetime,
          status:form.status
        })
      });

      const data = await res.json();

      if(!res.ok) throw new Error(data.error);

      router.push("/admin/dashboard/bookings");

    }catch(err:any){
      setError(err.message);
    }finally{
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">

      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-indigo-600" size={28}/>
            Create Booking
          </h2>

          <button
            onClick={()=>router.push("/admin/dashboard/bookings")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl"
          >
            ← Back
          </button>

        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            name="user_id"
            placeholder="User ID"
            value={form.user_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />

          <input
            name="resource_id"
            placeholder="Resource ID"
            value={form.resource_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />

          <input
            type="datetime-local"
            name="start_datetime"
            value={form.start_datetime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />

          <input
            type="datetime-local"
            name="end_datetime"
            value={form.end_datetime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

            <Link
              href="/admin/dashboard/bookings"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}