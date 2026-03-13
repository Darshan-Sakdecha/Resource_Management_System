"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Calendar, Building2, LogOut, UserCircle } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

const navLinks = [
    { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/user/dashboard/resources", label: "Resources", icon: Package },
    { href: "/user/dashboard/bookings", label: "My Bookings", icon: Calendar },
    { href: "/user/dashboard/buildings", label: "Buildings & Facilities", icon: Building2 },
    { href: "/user/dashboard/profile", label: "My Profile", icon: UserCircle },
];

export default function UserLayoutClient({ children }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
        router.replace("/login");
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-teal-700 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-teal-600">
                    <h2 className="text-2xl font-bold">User Panel</h2>
                    <p className="text-teal-200 text-sm mt-1">Resource Management</p>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 p-4 flex-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-white text-teal-700"
                                        : "text-white hover:bg-teal-600"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-teal-600">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}