"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type ChartItem = {
  status: string;
  count: number;
};

export default function AdminStatsChart({ data }: { data: ChartItem[] }) {
  const chartData = {
    labels: data.map(d => d.status),
    datasets: [
      {
        label: "Bookings",
        data: data.map(d => d.count),
        backgroundColor: [
          "#6366F1", // indigo
          "#22C55E", // green
          "#F59E0B", // amber
          "#EF4444", // red
        ],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Booking Status Overview
      </h3>
      <Bar data={chartData} />
    </div>
  );
}
