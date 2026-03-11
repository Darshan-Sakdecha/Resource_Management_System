import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

import Link from "next/link";
import { Building2, Edit2 } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

export default async function BuildingsPage() {
  await requireAuth([ROLES.ADMIN, ROLES.MANAGER]);

  const buildings = await prisma.buildings.findMany({
    orderBy: {
      building_id: "desc",
    },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-xl">
              <Building2 size={26} className="text-indigo-600" />
            </span>
            Buildings
          </h2>
          <p className="text-sm text-indigo-500 mt-1">
            Manage your buildings
          </p>
        </div>

        <Link
          href="/admin/dashboard/buildings/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-700"
        >
          + Add Building
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Number</th>
              <th className="p-4 text-left">Total Floors</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {buildings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No buildings found
                </td>
              </tr>
            ) : (
              buildings.map((building, index) => (
                <tr
                  key={building.building_id}
                  className={`border-t hover:bg-indigo-50 ${index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                    }`}
                >
                  <td className="p-4 text-gray-800 font-medium">
                    {building.building_id}
                  </td>
                  <td className="p-4 text-gray-800">{building.building_name}</td>
                  <td className="p-4 text-gray-800">{building.building_number}</td>
                  <td className="p-4 text-gray-800">{building.total_floors}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/buildings/${building.building_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>

                    <DeleteButton
                      id={building.building_id}
                      name="Building"
                      apiPath="buildings"
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