import { ReactNode } from "react";
import Sidebar from "../layouts/Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* ✅ Sidebar - Hidden on small screens */}
      <aside className="w-64 lg:w-72 hidden md:block bg-gray-900 border-r border-gray-800">
        <Sidebar />
      </aside>

      {/* ✅ Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
