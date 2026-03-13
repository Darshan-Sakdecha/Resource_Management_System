import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateMaintenance() {
    const resources = await prisma.resources.findMany();
    const maintenanceTypes = await prisma.maintenance.findMany({
        select: { maintenance_type: true },
        distinct: ["maintenance_type"],
    });

    async function createMaintenance(formData: FormData) {
        "use server";

        const resource_id = Number(formData.get("resource_id"));
        const maintenance_type = String(formData.get("maintenance_type"));
        const status = formData.get("status") as "scheduled" | "completed" | "cancelled";
        const scheduled_date = formData.get("scheduled_date")
            ? new Date(String(formData.get("scheduled_date")))
            : null;

        await prisma.maintenance.create({
            data: { resource_id, maintenance_type, status, scheduled_date, notes: null },
        });

        redirect("/management/dashboard/maintenance");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add Maintenance</h1>
                <Link href="/management/dashboard/maintenance" className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">
                    Back
                </Link>
            </div>

            <form action={createMaintenance} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Resource</label>
                        <select name="resource_id" className="border p-2 rounded w-full text-black">
                            {resources.map((r) => (
                                <option key={r.resource_id} value={r.resource_id}>{r.resource_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Maintenance Type</label>
                        <select name="maintenance_type" className="border p-2 rounded w-full text-black">
                            <option value="">-- Select Type --</option>
                            {maintenanceTypes.map((t, i) => (
                                <option key={i} value={t.maintenance_type}>{t.maintenance_type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Status</label>
                        <select name="status" className="border p-2 rounded w-full text-black">
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Scheduled Date</label>
                        <input type="date" name="scheduled_date" className="border p-2 rounded w-full text-black" />
                    </div>
                </div>

                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Save
                </button>
            </form>
        </div>
    );
}