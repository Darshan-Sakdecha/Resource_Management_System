import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/components/ui/DeleteButton";

export const revalidate = 0; // always fetch fresh data

export default async function ShelvesPage() {
  const shelves = await prisma.shelves.findMany({
    include: { cupboards: true },
    orderBy: { shelf_number: "asc" },
  });

  return (
    <div className="space-y-8 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-800">Shelves</h2>
          <p className="text-sm text-indigo-500 mt-1">Manage system shelves</p>
        </div>

        <Link
          href="/admin/dashboard/shelves/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Shelf
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Cupboard</th>
              <th className="p-4 text-left">Shelf Number</th>
              <th className="p-4 text-left">Capacity</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shelves.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-black">
                  No shelves found
                </td>
              </tr>
            ) : (
              shelves.map((shelf, index) => (
                <tr
                  key={shelf.shelf_id}
                  className={`border-t hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >
                  <td className="p-4 text-black">{shelf.shelf_id}</td>
                  <td className="p-4 text-black">{shelf.cupboards.cupboard_name}</td>
                  <td className="p-4 font-medium text-black">{shelf.shelf_number}</td>
                  <td className="p-4 text-black">{shelf.capacity}</td>
                  <td className="p-4 text-black max-w-[200px] truncate">{shelf.description || "-"}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/shelves/${shelf.shelf_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Edit
                    </Link>

                    <DeleteButton
                      id={shelf.shelf_id}
                      apiPath="shelves"
                      name={`Shelf ${shelf.shelf_number}`}
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