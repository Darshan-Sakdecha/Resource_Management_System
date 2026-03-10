"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number;
  totalPages: number;
}

export default function TablePagination({ page, totalPages }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const goToPage = (p: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", p.toString());

    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>

      <span className="px-3 py-1">
        {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  );
}