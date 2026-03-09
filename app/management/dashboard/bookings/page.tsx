"use client";

import { useEffect, useState } from "react";

interface Booking {
  booking_id: number;
  status: "pending" | "approved" | "rejected";
  resources: {
    resource_name: string;
  };
}

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        credentials: "include",
      });
      const data = await res.json();
      setBookings(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    bookingId: number,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating booking");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statusStyles = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-900 border border-yellow-400";
      case "approved":
        return "bg-green-200 text-green-900 border border-green-500";
      case "rejected":
        return "bg-red-200 text-red-900 border border-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Bookings
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Resource
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.booking_id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {b.resources.resource_name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase ${statusStyles(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    {b.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            update(b.booking_id, "approved")
                          }
                          disabled={updatingId === b.booking_id}
                          className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            update(b.booking_id, "rejected")
                          }
                          disabled={updatingId === b.booking_id}
                          className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
