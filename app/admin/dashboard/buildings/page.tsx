// app/admin/dashboard/buildings/page.tsx
import Link from "next/link";
import { Building2, Edit2 } from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";
import { getBuildings } from "@/app/lib/buildings";

interface Building {
  building_id: number;
  building_name: string;
  building_number: string;
  total_floors: number;
}

export default async function BuildingsPage({
  searchParams = {}, // ✅ default empty object
}: {
  searchParams?: {
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  // safe defaults
  const page = Number(searchParams.page ?? 1);
  const search = searchParams.search ?? "";
  const sortBy = searchParams.sortBy ?? "building_name";
  const sortOrder = searchParams.sortOrder === "desc" ? "desc" : "asc";

  // fetch buildings
  const { data, pagination } = await getBuildings({
    page,
    search,
    sortBy,
    sortOrder,
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
            Manage all building records
          </p>
        </div>

        <Link
          href="/admin/dashboard/buildings/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Building
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold tracking-wide">Name</th>
              <th className="p-4 text-left font-semibold tracking-wide">Number</th>
              <th className="p-4 text-left font-semibold tracking-wide">Floors</th>
              <th className="p-4 text-left font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No buildings found
                </td>
              </tr>
            ) : (
              data.map((building: Building, index: number) => (
                <tr
                  key={building.building_id}
                  className={`border-t transition duration-150 hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >
                  <td className="p-4 font-medium text-gray-800">{building.building_name}</td>
                  <td className="p-4 text-gray-600">{building.building_number}</td>
                  <td className="p-4 text-gray-600">{building.total_floors}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/buildings/${building.building_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <DeleteButton
                      id={building.building_id}
                      name={building.building_name}
                      apiPath="/api/buildings"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-indigo-700">
          Page <span className="font-semibold">{pagination.currentPage}</span> of{" "}
          <span className="font-semibold">{pagination.totalPages}</span>
        </span>
        <div className="flex gap-3">
          {pagination.currentPage > 1 && (
            <Link
              href={`?page=${pagination.currentPage - 1}`}
              className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
            >
              Previous
            </Link>
          )}
          {pagination.currentPage < pagination.totalPages && (
            <Link
              href={`?page=${pagination.currentPage + 1}`}
              className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
