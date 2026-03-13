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

const COLORS = ["#16a34a", "#2563eb", "#f97316", "#9333ea"];

const renderLabel = ({ name, value, x, y }: any) => (
    <text x={x} y={y} fill="#000000" fontSize={12} textAnchor="middle">
        {`${name}: ${value}`}
    </text>
);

const CustomTooltip = () => ({
    contentStyle: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        color: "#000000",
    },
    labelStyle: { color: "#000000" },
    itemStyle: { color: "#000000" },
});

export default function ManagerCharts({
    resourcesByType,
    resourcesByBuilding,
    bookingStats,
    maintenanceStats,
    facilityStats,
}: any) {

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

    return (
        <div className="grid grid-cols-2 gap-10">

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

            {/* Resources by Building */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-black font-bold mb-4">Resources by Building</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resourcesByBuilding}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: "#000000", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#000000", fontSize: 12 }} />
                        <Tooltip {...tooltipProps} />
                        <Bar dataKey="value" fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Booking Status */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-black font-bold mb-4">Booking Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={bookingStats}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            labelLine={false}
                            label={renderLabel}
                        >
                            {bookingStats.map((_: any, index: number) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipProps} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Maintenance Status */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-black font-bold mb-4">Maintenance Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={maintenanceStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: "#000000", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#000000", fontSize: 12 }} />
                        <Tooltip {...tooltipProps} />
                        <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Facilities per Resource */}
            <div className="bg-white p-6 rounded shadow col-span-2">
                <h2 className="text-black font-bold mb-4">Facilities per Resource</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={facilityStats}>
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