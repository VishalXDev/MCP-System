interface DashboardCardProps {
  title: string;
  value: string | number;
  bgColor?: string;
}

const DashboardCard = ({
  title,
  value,
  bgColor = "bg-white",
}: DashboardCardProps) => {
  // Backgrounds that require dark text
  const lightBackgrounds = ["bg-white", "bg-yellow-100", "bg-gray-100"];
  const textColor = lightBackgrounds.includes(bgColor) ? "text-black" : "text-white";

  return (
    <article
      className={`p-6 rounded-2xl shadow-sm min-w-40 transition-all duration-200 ease-in-out hover:scale-[1.02] ${bgColor} ${textColor}`}
      aria-label={`Dashboard card showing ${title} with value ${value}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </article>
  );
};

export default DashboardCard;
