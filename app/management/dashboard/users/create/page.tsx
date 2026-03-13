import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export default async function CreateUser() {
    const roles = await prisma.roles.findMany();

    async function createUser(formData: FormData) {
        "use server";

        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));
        const role_id = Number(formData.get("role_id"));

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: { name, email, password: hashedPassword, role_id },
        });

        redirect("/management/dashboard/users");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Add User</h1>
                <Link
                    href="/management/dashboard/users"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </Link>
            </div>

            <form action={createUser} className="bg-white border rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-black text-sm">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="border p-2 rounded w-full text-black"
                        />
                    </div>

                    <div>
                        <label className="text-black text-sm">Role</label>
                        <select name="role_id" className="border p-2 rounded w-full text-black">
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
                    Save
                </button>
            </form>
        </div>
    );
}