import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewCupboard({ params }: PageProps) {
    await requireAuth([ROLES.MANAGER]);

    const { id } = await params;

    const cupboard = await prisma.cupboards.findUnique({
        where: { cupboard_id: parseInt(id) },
        include: {
            resources: true,
            shelves: true,
        },
    });

    if (!cupboard) return <div className="text-black">Cupboard not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Cupboard Details</h1>
                <Link
                    href="/management/dashboard/cupboards"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            {/* Cupboard Info */}
            <div className="bg-white border rounded-lg shadow p-6 space-y-2">
                <p className="text-black"><span className="font-semibold">Cupboard Name:</span> {cupboard.cupboard_name}</p>
                <p className="text-black"><span className="font-semibold">Resource:</span> {cupboard.resources.resource_name}</p>
                <p className="text-black"><span className="font-semibold">Total Shelves:</span> {cupboard.total_shelves}</p>
            </div>

            {/* Shelves Table */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Shelves</h2>
                <Link
                    href={`/management/dashboard/shelves/create?cupboard_id=${cupboard.cupboard_id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Add Shelf
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead className="bg-green-100 text-black">
                        <tr>
                            <th className="p-3 text-left border">Shelf Number</th>
                            <th className="p-3 text-left border">Capacity</th>
                            <th className="p-3 text-left border">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cupboard.shelves.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-black">
                                    No shelves found
                                </td>
                            </tr>
                        )}
                        {cupboard.shelves.map((s) => (
                            <tr key={s.shelf_id} className="border-t hover:bg-gray-100 text-black">
                                <td className="p-3 border">{s.shelf_number}</td>
                                <td className="p-3 border">{s.capacity}</td>
                                <td className="p-3 border">{s.description ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}