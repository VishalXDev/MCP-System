interface DashboardCardProps {
  title: string;
  value: number | string;
  color?: string; // Optional color prop
}

const DashboardCard = ({ title, value, color = "bg-gray-800" }: DashboardCardProps) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md text-white`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

export default DashboardCard;
