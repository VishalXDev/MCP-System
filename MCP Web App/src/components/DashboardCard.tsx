interface DashboardCardProps {
  title: string;
  value: number | string;
  color?: string; // Optional color prop
}

const DashboardCard = ({ title, value, color = "bg-gray-800" }: DashboardCardProps) => {
  // Check if color is light, then change text color dynamically
  const textColor = color.includes("gray") || color.includes("dark") ? "text-white" : "text-black";

  return (
    <article className={`${color} ${textColor} p-6 rounded-lg shadow-md min-w-40`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </article>
  );
};

export default DashboardCard;
