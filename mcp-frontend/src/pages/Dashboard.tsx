import DashboardCard from "../components/DashboardCard";
const Dashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Wallet Balance" value="₹50,000" />
        <DashboardCard title="Total Orders" value="120" />
        <DashboardCard title="Active Partners" value="25" />
      </div>
    );
  };
  
  export default Dashboard;
  