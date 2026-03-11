import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/components/ui/DeleteButton";

export const revalidate = 0;

export default async function ResourceTypesPage() {
  const resourceTypes = await prisma.resource_types.findMany({
    orderBy: { type_name: "asc" },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-800">
            Resource Types
          </h2>
          <p className="text-sm text-indigo-500 mt-1">
            Manage resource categories
          </p>
        </div>

        <Link
          href="/admin/dashboard/resource-types/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Resource Type
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Type Name</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {resourceTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No resource types found
                </td>
              </tr>
            ) : (
              resourceTypes.map((type, index) => (
                <tr
                  key={type.resource_type_id}
                  className={`border-t hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >
                  <td className="p-4 text-gray-700">{type.resource_type_id}</td>

                  <td className="p-4 font-medium text-gray-800">
                    {type.type_name}
                  </td>

                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/resource-types/${type.resource_type_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Edit
                    </Link>

                    <DeleteButton
                      id={type.resource_type_id}
                      apiPath="resource-types"
                      name={type.type_name}
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