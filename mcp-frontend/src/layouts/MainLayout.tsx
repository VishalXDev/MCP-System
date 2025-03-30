import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-5 bg-gray-900 text-white h-full">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
