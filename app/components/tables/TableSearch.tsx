"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TableSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("search", value);
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      className="border rounded-lg px-3 py-2"
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}