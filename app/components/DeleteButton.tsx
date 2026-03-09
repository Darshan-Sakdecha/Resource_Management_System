"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: number;
  name: string;
  apiPath: string; // Pass "buildings", "resources", etc.
  onDeleted?: () => void; // Optional callback after deletion
}

export default function DeleteButton({ id, name, apiPath, onDeleted }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/${apiPath}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Failed to delete ${apiPath.slice(0, -1)}`);

      alert(`${name} deleted successfully!`);

      if (onDeleted) {
        onDeleted(); // Refresh data without reload
      } else {
        window.location.reload(); // fallback
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}
