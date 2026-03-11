"use client";

type StatCardProps = {
  title: string;
  value: number;
  color?: "blue" | "green" | "purple" | "yellow" | "pink" | "teal" | "orange";
};

const colorStyles = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  yellow: "bg-yellow-100 text-yellow-700",
  pink: "bg-pink-100 text-pink-700",
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
};

export default function StatCard({
  title,
  value,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-bold text-black">{value}</p>

        <span
          className={`px-3 py-1 text-sm rounded-full ${colorStyles[color]}`}
        >
          {title}
        </span>
      </div>
    </div>
  );
}