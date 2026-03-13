import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManagerResources() {

  await requireAuth([ROLES.MANAGER]);

  const resources = await prisma.resources.findMany({
    select: {
      resource_id: true,
      resource_name: true,
      floor_number: true,
      buildings: {
        select: { building_name: true },
      },
      resource_types: {
        select: { type_name: true },
      },
    },
  });

  async function deleteResource(formData: FormData) {
    "use server";
    const resource_id = Number(formData.get("resource_id"));
    await prisma.resources.delete({ where: { resource_id } });
    redirect("/management/dashboard/resources");
  }

  return (
    <div className="space-y-6">

      {/* ✅ Header with Add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Resources</h1>
        <Link
          href="/management/dashboard/resources/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Resource
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">

          <thead className="bg-green-100 text-black">
            <tr>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Type</th>
              <th className="p-3 text-left border">Building</th>
              <th className="p-3 text-left border">Floor</th>
              <th className="p-3 text-left border">Action</th>
            </tr>
          </thead>

          <tbody>
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-black">
                  No resources found
                </td>
              </tr>
            )}

            {resources.map((r) => (
              <tr key={r.resource_id} className="border-t hover:bg-gray-100 text-black">
                <td className="p-3 border">{r.resource_name}</td>
                <td className="p-3 border">{r.resource_types?.type_name}</td>
                <td className="p-3 border">{r.buildings?.building_name}</td>
                <td className="p-3 border">{r.floor_number}</td>
                <td className="p-3 border flex gap-2">
                  <Link
                    href={`/management/dashboard/resources/${r.resource_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>
                  <Link
                    href={`/management/dashboard/resources/edit/${r.resource_id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <form action={deleteResource}>
                    <input type="hidden" name="resource_id" value={r.resource_id} />
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}