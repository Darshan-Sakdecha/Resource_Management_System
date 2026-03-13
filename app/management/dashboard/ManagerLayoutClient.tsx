"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Calendar, Wrench, Building2, Users, LogOut, Home, Archive, Layers } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

const navLinks = [
    { href: "/management/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/management/dashboard/resources", label: "Resources", icon: Package },
    { href: "/management/dashboard/bookings", label: "Bookings", icon: Calendar },
    { href: "/management/dashboard/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/management/dashboard/facilities", label: "Facilities", icon: Building2 },
    { href: "/management/dashboard/users", label: "Users", icon: Users },
    { href: "/management/dashboard/buildings", label: "Buildings", icon: Home },
    { href: "/management/dashboard/cupboards", label: "Cupboards", icon: Archive },  // ✅ added
    { href: "/management/dashboard/shelves", label: "Shelves", icon: Layers },        // ✅ added
];

export default function ManagerLayoutClient({ children }: Props) {
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
            <aside className="w-64 bg-green-700 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-green-600">
                    <h2 className="text-2xl font-bold">Manager Panel</h2>
                    <p className="text-green-200 text-sm mt-1">Resource Management</p>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-white text-green-700"
                                    : "text-white hover:bg-green-600"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-green-600">
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