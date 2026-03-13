import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function MaintenancePage() {
  const maintenances = await prisma.maintenance.findMany({
    include: {
      resources: true,
    },
    orderBy: {
      scheduled_date: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Maintenance Records</h1>
        <Link
          href="/management/dashboard/maintenance/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Maintenance
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">
          <thead className="bg-green-100 text-black">
            <tr>
              <th className="p-3 border text-left">Resource</th>
              <th className="p-3 border text-left">Type</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Scheduled Date</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((m) => (
              <tr key={m.maintenance_id} className="border-t hover:bg-gray-100">
                <td className="p-3 border">{m.resources.resource_name}</td>
                <td className="p-3 border">{m.maintenance_type}</td>
                <td className="p-3 border">{m.status}</td>
                <td className="p-3 border">
                  {m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 border flex gap-2">
                  <Link
                    href={`/management/dashboard/maintenance/edit/${m.maintenance_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Edit
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