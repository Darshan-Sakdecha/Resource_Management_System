"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, PlusCircle } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

interface Role {
  role_id: number;
  role_name: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-indigo-50/40 p-6 rounded-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black flex items-center gap-3">
          <PlusCircle className="text-indigo-600" size={28} />
          Roles
        </h2>

        <Link
          href="/admin/dashboard/roles/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-700"
        >
          + Add Role
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Role Name</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role, idx) => (
                <tr
                  key={role.role_id}
                  className={`border-t hover:bg-indigo-50 ${idx % 2 === 0 ? "bg-white" : "bg-indigo-50/20"}`}
                >
                  <td className="p-4 text-black font-medium">{role.role_id}</td>
                  <td className="p-4 text-black">{role.role_name}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/roles/${role.role_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>

                    <DeleteButton
                      id={role.role_id}
                      name="Role"
                      apiPath="roles"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}