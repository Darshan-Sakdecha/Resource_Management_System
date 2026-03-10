import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

import Link from "next/link";
import { Edit2, Building2 } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

export default async function FacilitiesPage() {
  await requireAuth([ROLES.ADMIN]);

  const facilities = await prisma.facilities.findMany({
    include: {
      resources: true,
    },
    orderBy: {
      facility_id: "desc",
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
            Facilities
          </h2>

          <p className="text-sm text-indigo-500 mt-1">
            Manage all facility records
          </p>
        </div>

        <Link
          href="/admin/dashboard/facilities/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Facility
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <table className="w-full text-sm">

          {/* TABLE HEADER */}
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold tracking-wide">ID</th>
              <th className="p-4 text-left font-semibold tracking-wide">Facility Name</th>
              <th className="p-4 text-left font-semibold tracking-wide">Resource</th>
              <th className="p-4 text-left font-semibold tracking-wide">Details</th>
              <th className="p-4 text-left font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {facilities.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No facilities found
                </td>
              </tr>
            ) : (
              facilities.map((facility, index) => (
                <tr
                  key={facility.facility_id}
                  className={`border-t transition duration-150 hover:bg-indigo-50 ${index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                    }`}
                >
                  <td className="p-4 text-gray-700">
                    {facility.facility_id}
                  </td>

                  <td className="p-4 font-medium text-gray-800">
                    {facility.facility_name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {facility.resources?.resource_name ?? "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {facility.details ?? "-"}
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/admin/dashboard/facilities/${facility.facility_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>

                    <DeleteButton
                      id={facility.facility_id}
                      name={facility.facility_name}
                      apiPath="facilities"
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