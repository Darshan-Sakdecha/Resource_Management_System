import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export default async function UserResourcesPage() {
  await requireAuth([ROLES.USER]);

  const resources = await prisma.resources.findMany({
    include: {
      buildings: true,
      resource_types: true,
    },
    orderBy: { resource_name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Available Resources</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">
          <thead className="bg-teal-100 text-black">
            <tr>
              <th className="p-3 text-left border">Resource Name</th>
              <th className="p-3 text-left border">Type</th>
              <th className="p-3 text-left border">Building</th>
              <th className="p-3 text-left border">Floor</th>
              <th className="p-3 text-left border">Description</th>
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
                <td className="p-3 border">
                  <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                    {r.resource_types.type_name}
                  </span>
                </td>
                <td className="p-3 border">{r.buildings.building_name}</td>
                <td className="p-3 border">Floor {r.floor_number}</td>
                <td className="p-3 border">{r.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}