type StatCardProps = {
  title: string;
  value: number;
  color?: "blue" | "green" | "purple";
};

const colorMap = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function StatCard({
  title,
  value,
  color = "blue",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${colorMap[color]}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide">
        {title}
      </p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
