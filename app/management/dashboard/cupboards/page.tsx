import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";

export default async function CupboardsPage() {
    await requireAuth([ROLES.MANAGER]);

    const cupboards = await prisma.cupboards.findMany({
        include: { resources: true },
        orderBy: { cupboard_id: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Cupboards</h1>
                <Link
                    href="/management/dashboard/cupboards/create"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Add Cupboard
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead className="bg-green-100 text-black">
                        <tr>
                            <th className="p-3 text-left border">Cupboard Name</th>
                            <th className="p-3 text-left border">Resource</th>
                            <th className="p-3 text-left border">Total Shelves</th>
                            <th className="p-3 text-left border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cupboards.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-black">
                                    No cupboards found
                                </td>
                            </tr>
                        )}
                        {cupboards.map((c) => (
                            <tr key={c.cupboard_id} className="border-t hover:bg-gray-100 text-black">
                                <td className="p-3 border">{c.cupboard_name}</td>
                                <td className="p-3 border">{c.resources.resource_name}</td>
                                <td className="p-3 border">{c.total_shelves}</td>
                                <td className="p-3 border">
                                    <Link
                                        href={`/management/dashboard/cupboards/${c.cupboard_id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}