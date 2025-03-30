interface DashboardCardProps {
    title: string;
    value: string;
  }
  
  const DashboardCard = ({ title, value }: DashboardCardProps) => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    );
  };
  
  export default DashboardCard;
  