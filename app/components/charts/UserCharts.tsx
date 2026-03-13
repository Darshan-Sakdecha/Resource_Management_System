"use client";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#9333ea"];

const renderLabel = ({ name, value, x, y }: any) => (
    <text x={x} y={y} fill="#000000" fontSize={12} textAnchor="middle">
        {`${name}: ${value}`}
    </text>
);

const tooltipProps = {
    contentStyle: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        color: "#000000",
    },
    labelStyle: { color: "#000000" },
    itemStyle: { color: "#000000" },
};

interface Props {
    bookingsByStatus: { name: string; value: number }[];
    resourcesByType: { name: string; value: number }[];
    bookingsByResource: { name: string; value: number }[];
}

export default function UserCharts({
    bookingsByStatus,
    resourcesByType,
    bookingsByResource,
}: Props) {
    return (
        <div className="grid grid-cols-2 gap-10">

            {/* My Bookings by Status */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-black font-bold mb-4">My Bookings by Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={bookingsByStatus}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            labelLine={false}
                            label={renderLabel}
                        >
                            {bookingsByStatus.map((_: any, index: number) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipProps} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Resources by Type */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-black font-bold mb-4">Resources by Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={resourcesByType}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            labelLine={false}
                            label={renderLabel}
                        >
                            {resourcesByType.map((_: any, index: number) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipProps} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* My Bookings by Resource */}
            <div className="bg-white p-6 rounded shadow col-span-2">
                <h2 className="text-black font-bold mb-4">My Bookings by Resource</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingsByResource}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: "#000000", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#000000", fontSize: 12 }} />
                        <Tooltip {...tooltipProps} />
                        <Bar dataKey="value" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}