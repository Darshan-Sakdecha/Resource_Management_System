import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export default async function ProfilePage() {
    const currentUser = await getAuthUser();
    if (!currentUser) redirect("/login");

    const user = await prisma.users.findUnique({
        where: { user_id: currentUser.user_id },
        include: { roles: true },
    });

    if (!user) redirect("/login");

    async function updateProfile(formData: FormData) {
        "use server";

        const currentUser = await getAuthUser();
        if (!currentUser) redirect("/login");

        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const newPassword = formData.get("password") ? String(formData.get("password")) : null;
        const confirmPassword = formData.get("confirm_password") ? String(formData.get("confirm_password")) : null;

        // ✅ Check if email already taken by another user
        const existingEmail = await prisma.users.findFirst({
            where: {
                email,
                NOT: { user_id: currentUser.user_id },
            },
        });

        if (existingEmail) {
            redirect("/user/dashboard/profile?error=email");
        }

        // ✅ Check passwords match
        if (newPassword && newPassword !== confirmPassword) {
            redirect("/user/dashboard/profile?error=password");
        }

        const hashedPassword = newPassword
            ? await bcrypt.hash(newPassword, 10)
            : undefined;

        await prisma.users.update({
            where: { user_id: currentUser.user_id },
            data: {
                name,
                email,
                ...(hashedPassword && { password: hashedPassword }),
            },
        });

        redirect("/user/dashboard/profile?success=true");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">My Profile</h1>

            {/* Error / Success Messages */}
            <ProfileMessages />

            {/* Profile Info Card */}
            <div className="bg-white border rounded-lg shadow p-6 space-y-6">

                {/* Avatar & Role */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-black">{user.name}</p>
                        <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                            {user.roles.role_name}
                        </span>
                    </div>
                </div>

                {/* Update Form */}
                <form action={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-black text-sm">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={user.name}
                                className="border p-2 rounded w-full text-black mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-black text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={user.email}
                                className="border p-2 rounded w-full text-black mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-black text-sm">
                                New Password <span className="text-gray-400 text-xs">(leave blank to keep current)</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="border p-2 rounded w-full text-black mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-black text-sm">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="border p-2 rounded w-full text-black mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <p className="text-gray-400 text-xs">
                            Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

// ✅ Client component for messages
import ProfileMessages from "./ProfileMessages";