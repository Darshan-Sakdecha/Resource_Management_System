"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";

interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  roles?: { role_name: string };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data.data))
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter(u => u.user_id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/40 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Users</h2>
        <Link
          href="/admin/dashboard/users/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700"
        >
          + Add User
        </Link>
      </div>

      {loading ? (
        <p className="text-indigo-700">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden text-left text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user.user_id}
                  className={`border-t hover:bg-indigo-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >
                  <td className="p-4 text-gray-800 font-medium">{user.user_id}</td>
                  <td className="p-4 text-gray-800">{user.name}</td>
                  <td className="p-4 text-gray-800">{user.email}</td>
                  <td className="p-4 text-gray-800">{user.roles?.role_name ?? "-"}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/users/${user.user_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}