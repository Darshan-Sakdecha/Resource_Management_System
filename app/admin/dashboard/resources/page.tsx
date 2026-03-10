import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

import Link from "next/link";
import { Edit2, Boxes } from "lucide-react";
import DeleteButton from "@/app/components/ui/DeleteButton";

export default async function ResourcesPage() {
  await requireAuth([ROLES.ADMIN]);

  const resources = await prisma.resources.findMany({
    include: {
      buildings: true,
      resource_types: true,
    },
    orderBy: {
      resource_id: "desc",
    },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">

            <span className="bg-indigo-100 p-2 rounded-xl">
              <Boxes size={26} className="text-indigo-600" />
            </span>

            Resources
          </h2>

          <p className="text-sm text-indigo-500 mt-1">
            Manage system resources
          </p>
        </div>

        <Link
          href="/admin/dashboard/resources/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Resource
        </Link>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Resource Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Building</th>
              <th className="p-4 text-left">Floor</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {resources.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No resources found
                </td>
              </tr>
            ) : (
              resources.map((item, index) => (
                <tr
                  key={item.resource_id}
                  className={`border-t hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >

                  <td className="p-4 text-gray-700">
                    {item.resource_id}
                  </td>

                  <td className="p-4 font-medium text-gray-800">
                    {item.resource_name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.resource_types?.type_name ?? "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.buildings?.building_name ?? "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.floor_number}
                  </td>

                  <td className="p-4 text-gray-600 max-w-[200px] truncate">
                    {item.description ?? "-"}
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/admin/dashboard/resources/${item.resource_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16}/>
                      Edit
                    </Link>

                    <DeleteButton
                      id={item.resource_id}
                      name={item.resource_name}
                      apiPath="resources"
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