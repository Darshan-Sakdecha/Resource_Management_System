"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  items,
}: {
  items: { label: string; href: string; icon: any }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5">
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  active
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}