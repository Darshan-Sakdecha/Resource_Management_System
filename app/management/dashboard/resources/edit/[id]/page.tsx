import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditResource({
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
    });

    if (!resource) {
        return <div className="text-black">Resource not found</div>;
    }

    async function updateResource(formData: FormData) {
        "use server";

        const description = formData.get("description") as string;

        await prisma.resources.update({
            where: {
                resource_id: parseInt(id),
            },
            data: {
                description,
            },
        });

        redirect("/management/dashboard/resources");
    }

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold text-black">
                Edit Resource
            </h1>

            <form
                action={updateResource}
                className="bg-white p-6 border rounded-lg shadow space-y-4"
            >

                {/* Resource Name */}
                <div>
                    <label className="block text-black font-medium mb-1">
                        Resource Name
                    </label>

                    <input
                        type="text"
                        value={resource.resource_name}
                        disabled
                        className="w-full border p-2 rounded bg-gray-100 text-black"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-black font-medium mb-1">
                        Description
                    </label>

                    <textarea
                        name="description"
                        defaultValue={resource.description || ""}
                        rows={4}
                        className="w-full border p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Update Resource
                    </button>

                    <Link
                        href="/management/dashboard/resources"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}