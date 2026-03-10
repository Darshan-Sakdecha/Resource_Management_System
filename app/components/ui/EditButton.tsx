"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

export default function EditButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
    >
      <Pencil size={16} />
      Edit
    </Link>
  );
}