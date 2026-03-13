import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export default async function UserBuildingsPage() {
    await requireAuth([ROLES.USER]);

    const buildings = await prisma.buildings.findMany({
        include: {
            resources: {
                include: {
                    resource_types: true,
                    facilities: true,
                },
            },
        },
        orderBy: { building_name: "asc" },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Buildings & Facilities</h1>

            <div className="space-y-6">
                {buildings.length === 0 && (
                    <div className="bg-white border rounded-lg shadow p-6 text-center text-gray-500">
                        No buildings found.
                    </div>
                )}

                {buildings.map((b) => (
                    <div key={b.building_id} className="bg-white border rounded-lg shadow">

                        {/* Building Header */}
                        <div className="bg-teal-100 px-6 py-4 rounded-t-lg flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-black">{b.building_name}</h2>
                                <p className="text-sm text-gray-600">
                                    Building No: {b.building_number} &nbsp;|&nbsp; Total Floors: {b.total_floors}
                                </p>
                            </div>
                            <span className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
                                {b.resources.length} Resources
                            </span>
                        </div>

                        {/* Resources Table */}
                        {b.resources.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-black">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 text-left border">Resource Name</th>
                                            <th className="p-3 text-left border">Type</th>
                                            <th className="p-3 text-left border">Floor</th>
                                            <th className="p-3 text-left border">Facilities</th>
                                            <th className="p-3 text-left border">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {b.resources.map((r) => (
                                            <tr key={r.resource_id} className="border-t hover:bg-gray-50">
                                                <td className="p-3 border">{r.resource_name}</td>
                                                <td className="p-3 border">
                                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                                                        {r.resource_types.type_name}
                                                    </span>
                                                </td>
                                                <td className="p-3 border">Floor {r.floor_number}</td>
                                                <td className="p-3 border">
                                                    {r.facilities.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {r.facilities.map((f) => (
                                                                <span
                                                                    key={f.facility_id}
                                                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                                >
                                                                    {f.facility_name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="p-3 border text-gray-600">
                                                    {r.description ?? "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="p-4 text-gray-500 text-sm">No resources in this building.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}