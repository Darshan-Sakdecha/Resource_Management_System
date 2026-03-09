"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Building2, Edit2, Box } from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";

interface Resource {
  resource_id: number;
  resource_name: string;
  floor_number: number;
  description: string | null;
  buildings: { building_name: string };
  resource_types: { type_name: string };
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const fetchResources = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resources?page=${page}`);
      const data = await res.json();

      setResources(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="space-y-6 bg-indigo-50/40 p-6 rounded-2xl min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-xl">
              <Box size={26} className="text-indigo-600" />
            </span>
            Resources
          </h2>
          <p className="text-sm text-indigo-500 mt-1">
            Manage all resources
          </p>
        </div>

        <Link
          href="/admin/dashboard/resources/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          + Add Resource
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold tracking-wide">Name</th>
              <th className="p-4 text-left font-semibold tracking-wide">Type</th>
              <th className="p-4 text-left font-semibold tracking-wide">Building</th>
              <th className="p-4 text-left font-semibold tracking-wide">Floor</th>
              <th className="p-4 text-left font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No resources found
                </td>
              </tr>
            ) : (
              resources.map((res) => (
                <tr
                  key={res.resource_id}
                  className="border-t transition duration-150 hover:bg-indigo-50"
                >
                  <td className="p-4 font-medium text-gray-800">{res.resource_name}</td>
                  <td className="p-4 text-gray-600">{res.resource_types.type_name}</td>
                  <td className="p-4 text-gray-600">{res.buildings.building_name}</td>
                  <td className="p-4 text-gray-600">{res.floor_number}</td>
                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/resources/${res.resource_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <DeleteButton
                      id={res.resource_id}
                      name={res.resource_name}
                      apiPath="/api/resources"
                      onDeleted={() => fetchResources(pagination.currentPage)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-indigo-700">
          Page <span className="font-semibold">{pagination.currentPage}</span> of{" "}
          <span className="font-semibold">{pagination.totalPages}</span>
        </span>
        <div className="flex gap-3">
          {pagination.currentPage > 1 && (
            <button
              onClick={() => fetchResources(pagination.currentPage - 1)}
              className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
            >
              Previous
            </button>
          )}
          {pagination.currentPage < pagination.totalPages && (
            <button
              onClick={() => fetchResources(pagination.currentPage + 1)}
              className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
