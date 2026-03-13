import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateFacility() {
    const resources = await prisma.resources.findMany();

    async function createFacility(formData: FormData) {
        "use server";

        const resource_id = Number(formData.get("resource_id"));
        const facility_name = String(formData.get("facility_name"));
        const details = formData.get("details") ? String(formData.get("details")) : null;

        await prisma.facilities.create({
            data: { resource_id, facility_name, details },
        });

        redirect("/management/dashboard/facilities");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add Facility</h1>
                <Link
                    href="/management/dashboard/facilities"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={createFacility} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
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
                        <label className="text-black text-sm">Facility Name</label>
                        <input
                            type="text"
                            name="facility_name"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="text-black text-sm">Details</label>
                        <textarea
                            name="details"
                            rows={4}
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