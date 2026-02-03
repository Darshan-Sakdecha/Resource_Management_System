"use client";

import { useEffect, useState } from "react";

interface Booking {
  booking_id: number;
  status: string;
  resource: {
    resource_name: string;
  };
}

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from API
  const load = async () => {
    try {
      const res = await fetch("/api/bookings", { credentials: "include" });
      const data = await res.json();
      setBookings(data.data); // assuming your API returns { data: [...] }
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  // Update booking status
  const update = async (bookingId: number, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH", // or PUT depending on your backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update booking");
      }

      // Update the UI locally without reloading
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating booking");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.booking_id} style={{ marginBottom: "10px" }}>
            <strong>{b.resource.resource_name}</strong> — {b.status}
            {b.status === "pending" && (
              <>
                <button
                  onClick={() => update(b.booking_id, "approved")}
                  style={{ marginLeft: "10px" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => update(b.booking_id, "rejected")}
                  style={{ marginLeft: "5px" }}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
