import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ cupboard_id?: string }>;
}

export default async function CreateShelf({ searchParams }: PageProps) {
    await requireAuth([ROLES.MANAGER]);

    const { cupboard_id } = await searchParams;

    const cupboards = await prisma.cupboards.findMany();

    async function createShelf(formData: FormData) {
        "use server";

        const cupboard_id = Number(formData.get("cupboard_id"));
        const shelf_number = Number(formData.get("shelf_number"));
        const capacity = Number(formData.get("capacity"));
        const description = formData.get("description") ? String(formData.get("description")) : null;

        await prisma.shelves.create({
            data: { cupboard_id, shelf_number, capacity, description },
        });

        redirect(`/management/dashboard/cupboards/${cupboard_id}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add Shelf</h1>
                <Link
                    href={cupboard_id ? `/management/dashboard/cupboards/${cupboard_id}` : "/management/dashboard/cupboards"}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={createShelf} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Cupboard</label>
                        <select
                            name="cupboard_id"
                            defaultValue={cupboard_id ?? ""}
                            className="border p-2 rounded w-full text-black"
                        >
                            {cupboards.map((c) => (
                                <option key={c.cupboard_id} value={c.cupboard_id}>
                                    {c.cupboard_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-black text-sm">Shelf Number</label>
                        <input
                            type="number"
                            name="shelf_number"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
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