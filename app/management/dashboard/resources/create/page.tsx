import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateResource() {
    const buildings = await prisma.buildings.findMany();
    const resourceTypes = await prisma.resource_types.findMany();

    async function createResource(formData: FormData) {
        "use server";

        const resource_name = String(formData.get("resource_name"));
        const resource_type_id = Number(formData.get("resource_type_id"));
        const building_id = Number(formData.get("building_id"));
        const floor_number = Number(formData.get("floor_number"));
        const description = formData.get("description") ? String(formData.get("description")) : null;

        await prisma.resources.create({
            data: { resource_name, resource_type_id, building_id, floor_number, description },
        });

        redirect("/management/dashboard/resources");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add Resource</h1>
                <Link
                    href="/management/dashboard/resources"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={createResource} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Resource Name</label>
                        <input
                            type="text"
                            name="resource_name"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Resource Type</label>
                        <select name="resource_type_id" className="border p-2 rounded w-full text-black">
                            {resourceTypes.map((t) => (
                                <option key={t.resource_type_id} value={t.resource_type_id}>
                                    {t.type_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Building</label>
                        <select name="building_id" className="border p-2 rounded w-full text-black">
                            {buildings.map((b) => (
                                <option key={b.building_id} value={b.building_id}>
                                    {b.building_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Floor Number</label>
                        <input
                            type="number"
                            name="floor_number"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="text-black text-sm">Description</label>
                        <textarea
                            name="description"
                            rows={3}
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