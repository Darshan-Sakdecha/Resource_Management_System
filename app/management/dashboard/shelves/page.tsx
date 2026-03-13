import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";

export default async function ShelvesPage() {
    await requireAuth([ROLES.MANAGER]);

    const shelves = await prisma.shelves.findMany({
        include: {
            cupboards: {
                include: {
                    resources: true,
                },
            },
        },
        orderBy: { shelf_id: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Shelves</h1>
                <Link
                    href="/management/dashboard/shelves/create"
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
                            <th className="p-3 text-left border">Cupboard</th>
                            <th className="p-3 text-left border">Resource</th>
                            <th className="p-3 text-left border">Capacity</th>
                            <th className="p-3 text-left border">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shelves.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-black">
                                    No shelves found
                                </td>
                            </tr>
                        )}
                        {shelves.map((s) => (
                            <tr key={s.shelf_id} className="border-t hover:bg-gray-100 text-black">
                                <td className="p-3 border">{s.shelf_number}</td>
                                <td className="p-3 border">{s.cupboards.cupboard_name}</td>
                                <td className="p-3 border">{s.cupboards.resources.resource_name}</td>
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