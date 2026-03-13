import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateCupboard() {
    await requireAuth([ROLES.MANAGER]);

    const resources = await prisma.resources.findMany();

    async function createCupboard(formData: FormData) {
        "use server";

        const resource_id = Number(formData.get("resource_id"));
        const cupboard_name = String(formData.get("cupboard_name"));
        const total_shelves = Number(formData.get("total_shelves"));

        await prisma.cupboards.create({
            data: { resource_id, cupboard_name, total_shelves },
        });

        redirect("/management/dashboard/cupboards");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add Cupboard</h1>
                <Link
                    href="/management/dashboard/cupboards"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={createCupboard} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Cupboard Name</label>
                        <input
                            type="text"
                            name="cupboard_name"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Resource</label>
                        <select name="resource_id" className="border p-2 rounded w-full text-black">
                            {resources.map((r) => (
                                <option key={r.resource_id} value={r.resource_id}>
                                    {r.resource_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Total Shelves</label>
                        <input
                            type="number"
                            name="total_shelves"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}