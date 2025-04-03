interface DashboardCardProps {
  title: string;
  value: string | number;
  color?: string; // Default color is optional
}

const DashboardCard = ({ title, value, color = "text-gray-800" }: DashboardCardProps) => {
  // Define light text colors that need a black text alternative
  const lightTextColors = ["text-gray-800", "text-yellow-500", "text-black"];
  const textColor = lightTextColors.includes(color) ? "text-black" : "text-white";

  return (
    <article className={`bg-white p-6 rounded-lg shadow-md min-w-40 ${color} ${textColor}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </article>
  );
};

export default DashboardCard;
