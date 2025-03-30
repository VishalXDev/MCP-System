import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold">MCP System</h2>
      <nav className="mt-5">
        <ul className="space-y-3">
          <li>
            <Link to="/" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/orders" className="block p-2 rounded hover:bg-gray-700">
              Orders
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
