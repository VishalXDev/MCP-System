import Sidebar from '../layouts/Sidebar';
import Navbar from './Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-5 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
