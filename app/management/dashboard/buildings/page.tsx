import { prisma } from "@/app/lib/prisma";

export default async function BuildingsPage() {
    const buildings = await prisma.buildings.findMany({
        include: {
            resources: {
                include: {
                    resource_types: true,
                },
            },
        },
        orderBy: { building_name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Buildings & Rooms</h1>
            </div>

            <div className="space-y-6">
                {buildings.map((b) => (
                    <div key={b.building_id} className="bg-white border rounded-lg shadow">
                        {/* Building Header */}
                        <div className="bg-green-100 px-6 py-4 rounded-t-lg flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-black">{b.building_name}</h2>
                                <p className="text-sm text-gray-600">
                                    Building No: {b.building_number} &nbsp;|&nbsp; Total Floors: {b.total_floors}
                                </p>
                            </div>
                            <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
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
                                            <th className="p-3 text-left border">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {b.resources.map((r) => (
                                            <tr key={r.resource_id} className="border-t hover:bg-gray-50">
                                                <td className="p-3 border">{r.resource_name}</td>
                                                <td className="p-3 border">{r.resource_types.type_name}</td>
                                                <td className="p-3 border">Floor {r.floor_number}</td>
                                                <td className="p-3 border">{r.description ?? "—"}</td>
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

                {buildings.length === 0 && (
                    <div className="bg-white border rounded-lg shadow p-6 text-center text-gray-500">
                        No buildings found.
                    </div>
                )}
            </div>
        </div>
    );
}