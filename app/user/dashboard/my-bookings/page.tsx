"use client";

import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/bookings", { credentials: "include" })
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">My Bookings</h1>
      <ul>
        {data.map((b: any) => (
          <li key={b.booking_id}>
            {b.resource.resource_name} — {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
