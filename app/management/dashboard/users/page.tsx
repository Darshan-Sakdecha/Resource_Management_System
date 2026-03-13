import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const users = await prisma.users.findMany({
        include: { roles: true },
        orderBy: { created_at: "desc" },
    });

    async function deleteUser(formData: FormData) {
        "use server";
        const user_id = Number(formData.get("user_id"));
        await prisma.users.delete({ where: { user_id } });
        redirect("/management/dashboard/users");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Users</h1>
                <Link
                    href="/management/dashboard/users/create"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Add User
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead className="bg-green-100 text-black">
                        <tr>
                            <th className="p-3 border text-left">Name</th>
                            <th className="p-3 border text-left">Email</th>
                            <th className="p-3 border text-left">Role</th>
                            <th className="p-3 border text-left">Created At</th>
                            <th className="p-3 border text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.user_id} className="border-t hover:bg-gray-100">
                                <td className="p-3 border">{u.name}</td>
                                <td className="p-3 border">{u.email}</td>
                                <td className="p-3 border">{u.roles.role_name}</td>
                                <td className="p-3 border">
                                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                                </td>
                                <td className="p-3 border flex gap-2">
                                    <Link
                                        href={`/management/dashboard/users/edit/${u.user_id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <form action={deleteUser}>
                                        <input type="hidden" name="user_id" value={u.user_id} />
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
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}