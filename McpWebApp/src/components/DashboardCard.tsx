interface DashboardCardProps {
  title: string;
  value: string | number;
  bgColor?: string; // renamed from `color` to `bgColor` for clarity
}

const DashboardCard = ({
  title,
  value,
  bgColor = "bg-white", // Default background color
}: DashboardCardProps) => {
  // Define background colors that require dark text
  const lightBackgrounds = ["bg-white", "bg-yellow-100", "bg-gray-100"];
  const textColor = lightBackgrounds.includes(bgColor) ? "text-black" : "text-white";

  return (
    <article
      className={`p-6 rounded-lg shadow-md min-w-40 ${bgColor} ${textColor}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </article>
  );
};

export default DashboardCard;
