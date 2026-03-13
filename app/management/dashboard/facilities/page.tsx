import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FacilitiesPage() {
  const facilities = await prisma.facilities.findMany({
    include: { resources: true },
  });

  async function deleteFacility(formData: FormData) {
    "use server";
    const facility_id = Number(formData.get("facility_id"));
    await prisma.facilities.delete({ where: { facility_id } });
    redirect("/management/dashboard/facilities");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Facilities</h1>
        <Link
          href="/management/dashboard/facilities/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Facility
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">
          <thead className="bg-green-100 text-black">
            <tr>
              <th className="p-3 border text-left">Resource</th>
              <th className="p-3 border text-left">Facility Name</th>
              <th className="p-3 border text-left">Details</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f) => (
              <tr key={f.facility_id} className="border-t hover:bg-gray-100">
                <td className="p-3 border">{f.resources.resource_name}</td>
                <td className="p-3 border">{f.facility_name}</td>
                <td className="p-3 border">{f.details ?? "—"}</td>
                <td className="p-3 border flex gap-2">
                  <Link
                    href={`/management/dashboard/facilities/edit/${f.facility_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <form action={deleteFacility}>
                    <input type="hidden" name="facility_id" value={f.facility_id} />
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {facilities.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No facilities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}