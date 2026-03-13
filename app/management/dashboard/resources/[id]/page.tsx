import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";

export default async function ResourceDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAuth([ROLES.MANAGER]);

    const { id } = await params;

    const resource = await prisma.resources.findUnique({
        where: {
            resource_id: parseInt(id),
        },
        include: {
            buildings: true,
            resource_types: true,
            facilities: true,
            cupboards: true,
            maintenance: true,
        },
    });

    if (!resource) {
        return <div className="text-black">Resource not found</div>;
    }

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-black">
                    {resource.resource_name}
                </h1>

                <Link
                    href="/management/dashboard/resources"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            {/* Resource Info */}
            <div className="bg-white border rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-black mb-4">
                    Resource Information
                </h2>

                <div className="grid grid-cols-2 gap-6 text-black">

                    <div>
                        <p className="text-gray-500 text-sm">Type</p>
                        <p className="font-medium">
                            {resource.resource_types.type_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Building</p>
                        <p className="font-medium">
                            {resource.buildings.building_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Floor</p>
                        <p className="font-medium">
                            {resource.floor_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Description</p>
                        <p className="font-medium">
                            {resource.description || "No description"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Facilities */}
            <div className="bg-white border rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-black mb-4">
                    Facilities
                </h2>

                {resource.facilities.length === 0 ? (
                    <p className="text-gray-500">No facilities available</p>
                ) : (
                    <ul className="list-disc pl-5 text-black space-y-1">
                        {resource.facilities.map((f) => (
                            <li key={f.facility_id}>
                                {f.facility_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Cupboards */}
            <div className="bg-white border rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-black mb-4">
                    Cupboards
                </h2>

                {resource.cupboards.length === 0 ? (
                    <p className="text-gray-500">No cupboards available</p>
                ) : (
                    <ul className="list-disc pl-5 text-black space-y-1">
                        {resource.cupboards.map((c) => (
                            <li key={c.cupboard_id}>
                                {c.cupboard_name} (Shelves: {c.total_shelves})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Maintenance */}
            <div className="bg-white border rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-black mb-4">
                    Maintenance
                </h2>

                {resource.maintenance.length === 0 ? (
                    <p className="text-gray-500">No maintenance records</p>
                ) : (
                    <ul className="space-y-2 text-black">
                        {resource.maintenance.map((m) => (
                            <li
                                key={m.maintenance_id}
                                className="border p-3 rounded bg-gray-50"
                            >
                                <b>{m.maintenance_type}</b> – {m.status}
                                <br />
                                <span className="text-sm text-gray-500">
                                    {m.scheduled_date?.toString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}