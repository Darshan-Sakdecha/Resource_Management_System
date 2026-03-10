import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

import Link from "next/link";
import { Edit2, Wrench } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

export default async function MaintenancePage() {
  await requireAuth([ROLES.ADMIN]);

  const maintenance = await prisma.maintenance.findMany({
    include: {
      resources: true,
    },
    orderBy: {
      maintenance_id: "desc",
    },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-xl">
              <Wrench size={26} className="text-indigo-600" />
            </span>
            Maintenance
          </h2>

          <p className="text-sm text-indigo-500 mt-1">
            Manage maintenance records
          </p>
        </div>

        <Link
          href="/admin/dashboard/maintenance/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Maintenance
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">

        <table className="w-full text-sm">

          {/* TABLE HEADER */}
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold tracking-wide">ID</th>
              <th className="p-4 text-left font-semibold tracking-wide">Resource</th>
              <th className="p-4 text-left font-semibold tracking-wide">Type</th>
              <th className="p-4 text-left font-semibold tracking-wide">Status</th>
              <th className="p-4 text-left font-semibold tracking-wide">Scheduled Date</th>
              <th className="p-4 text-left font-semibold tracking-wide">Notes</th>
              <th className="p-4 text-left font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {maintenance.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No maintenance records found
                </td>
              </tr>
            ) : (
              maintenance.map((item, index) => (
                <tr
                  key={item.maintenance_id}
                  className={`border-t transition duration-150 hover:bg-indigo-50 ${index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                    }`}
                >

                  {/* ID */}
                  <td className="p-4 text-gray-700">
                    {item.maintenance_id}
                  </td>

                  {/* RESOURCE */}
                  <td className="p-4 text-gray-600">
                    {item.resources?.resource_name ?? "-"}
                  </td>

                  {/* TYPE */}
                  <td className="p-4 font-medium text-gray-800">
                    {item.maintenance_type}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {item.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-600">
                    {item.scheduled_date
                      ? new Date(item.scheduled_date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* NOTES */}
                  <td className="p-4 text-gray-600 max-w-[200px] truncate">
                    {item.notes ?? "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/admin/dashboard/maintenance/${item.maintenance_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>

                    <DeleteButton
                      id={item.maintenance_id}
                      name={item.maintenance_type}
                      apiPath="maintenance"
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