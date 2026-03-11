"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit2, ArrowLeft } from "lucide-react";

interface Resource {
    resource_id: number;
    resource_name: string;
}

interface Maintenance {
    maintenance_id: number;
    resource_id: number;
    maintenance_type: string;
    scheduled_date: string | null;
    status: string;
    notes: string | null;
}

export default function EditMaintenancePage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [resources, setResources] = useState<Resource[]>([]);

    const [form, setForm] = useState({
        resource_id: "",
        maintenance_type: "",
        scheduled_date: "",
        status: "",
        notes: "",
    });

    /* FETCH RESOURCES */

    useEffect(() => {

        const fetchResources = async () => {

            const res = await fetch("/api/resources");
            const data = await res.json();

            const list = Array.isArray(data) ? data : data.data || [];

            setResources(list);

        };

        fetchResources();

    }, []);

    /* FETCH MAINTENANCE DATA */

    useEffect(() => {

        if (!id) return;

        const fetchMaintenance = async () => {

            const res = await fetch(`/api/maintenance/${id}`);
            const data: Maintenance = await res.json();

            setForm({
                resource_id: data.resource_id.toString(),
                maintenance_type: data.maintenance_type,
                scheduled_date: data.scheduled_date
                    ? data.scheduled_date.substring(0, 10)
                    : "",
                status: data.status,
                notes: data.notes ?? "",
            });

        };

        fetchMaintenance();

    }, [id]);

    /* HANDLE CHANGE */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    /* HANDLE SUBMIT */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        await fetch(`/api/maintenance/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                resource_id: Number(form.resource_id),
                maintenance_type: form.maintenance_type,
                scheduled_date: form.scheduled_date,
                status: form.status,
                notes: form.notes,
            }),
        });

        router.push("/admin/dashboard/maintenance");

    };

    return (

        <div className="min-h-screen bg-indigo-50/40 p-6 flex justify-center">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border">

                {/* HEADER */}

                <div className="bg-indigo-600 text-white px-8 py-6 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <Edit2 />
                        <h2 className="text-lg font-semibold">Edit Maintenance</h2>
                    </div>

                    {/* BACK BUTTON */}

                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                </div>

                {/* FORM */}

                <form onSubmit={handleSubmit} className="p-10 space-y-6">

                    {/* RESOURCE */}

                    <select
                        name="resource_id"
                        value={form.resource_id}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-5 py-3 text-black"
                    >

                        {resources.map((r) => (
                            <option key={r.resource_id} value={r.resource_id}>
                                {r.resource_name}
                            </option>
                        ))}

                    </select>

                    {/* TYPE */}

                    <input
                        type="text"
                        name="maintenance_type"
                        value={form.maintenance_type}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-5 py-3 text-black"
                    />

                    {/* DATE */}

                    <input
                        type="date"
                        name="scheduled_date"
                        value={form.scheduled_date}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-5 py-3 text-black"
                    />

                    {/* STATUS DROPDOWN */}

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-5 py-3 text-black"
                    >

                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>

                    </select>

                    {/* NOTES */}

                    <textarea
                        name="notes"
                        rows={4}
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-5 py-3 text-black"
                    />

                    {/* UPDATE BUTTON */}

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
                    >
                        Update Maintenance
                    </button>

                </form>

            </div>

        </div>

    );

}