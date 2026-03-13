import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditUser({ params }: PageProps) {
    const { id } = await params;

    const user = await prisma.users.findUnique({
        where: { user_id: parseInt(id) },
        include: { roles: true },
    });

    if (!user) return <div className="text-black">User not found</div>;

    const roles = await prisma.roles.findMany();

    async function updateUser(formData: FormData) {
        "use server";

        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const role_id = Number(formData.get("role_id"));
        const newPassword = formData.get("password") ? String(formData.get("password")) : null;

        const hashedPassword = newPassword
            ? await bcrypt.hash(newPassword, 10)
            : user!.password;

        await prisma.users.update({
            where: { user_id: parseInt(id) },
            data: { name, email, role_id, password: hashedPassword },
        });

        redirect("/management/dashboard/users");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Edit User</h1>
                <Link
                    href="/management/dashboard/users"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={updateUser} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={user.name}
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={user.email}
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">
                            New Password <span className="text-gray-400">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Role</label>
                        <select name="role_id" defaultValue={user.role_id} className="border p-2 rounded w-full text-black">
                            {roles.map((r) => (
                                <option key={r.role_id} value={r.role_id}>
                                    {r.role_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
}