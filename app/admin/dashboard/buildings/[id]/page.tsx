"use client";

import { useState,useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function EditBookingPage(){

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form,setForm] = useState({
    user_id:"",
    resource_id:"",
    start_datetime:"",
    end_datetime:"",
    status:"scheduled"
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  useEffect(()=>{

    if(!id) return;

    fetch(`/api/bookings/${id}`)
      .then(res=>res.json())
      .then(data=>{

        setForm({
          user_id:data.user_id,
          resource_id:data.resource_id,
          start_datetime:data.start_datetime.slice(0,16),
          end_datetime:data.end_datetime.slice(0,16),
          status:data.status
        });

      });

  },[id]);

  const handleChange=(e:any)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit=async(e:any)=>{

    e.preventDefault();
    setLoading(true);

    await fetch(`/api/bookings/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        user_id:Number(form.user_id),
        resource_id:Number(form.resource_id),
        start_datetime:form.start_datetime,
        end_datetime:form.end_datetime,
        status:form.status
      })
    });

    router.push("/admin/dashboard/bookings");

  };

  return (

    <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-indigo-100">

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between text-white">

          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit2 size={24}/>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Edit Booking</h2>
              <p className="text-sm text-indigo-100">Update booking details</p>
            </div>
          </div>

          <Link
            href="/admin/dashboard/bookings"
            className="text-sm text-indigo-100 hover:text-white"
          >
            Back
          </Link>

        </div>

        <div className="p-10">

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200"
            />

            <input
              name="resource_id"
              value={form.resource_id}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200"
            />

            <input
              type="datetime-local"
              name="start_datetime"
              value={form.start_datetime}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200"
            />

            <input
              type="datetime-local"
              name="end_datetime"
              value={form.end_datetime}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-indigo-200"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end gap-4 pt-4 border-t border-indigo-100">

              <Link
                href="/admin/dashboard/bookings"
                className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? "Updating..." : "Update Booking"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}