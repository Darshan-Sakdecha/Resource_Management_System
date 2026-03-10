"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { status: string; count: number }[];
}

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

export default function AdminStatsChart({ data }: Props) {
  return (
    <div className="w-full h-[350px] bg-white rounded-xl shadow p-4">

      {/* Prevent chart crash if data is empty */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No booking data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              outerRadius={110}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}