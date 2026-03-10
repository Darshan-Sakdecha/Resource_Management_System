"use client";

import { Trash2 } from "lucide-react";

interface Props {
  id: number;
  apiPath: string;
  name: string;
  onDeleted?: () => void;
}

export default function DeleteButton({
  id,
  apiPath,
  name,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    if (!confirm(`Delete ${name}?`)) return;

    const res = await fetch(`/api/${apiPath}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    alert("Deleted successfully");

    if (onDeleted) onDeleted();
    else window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}