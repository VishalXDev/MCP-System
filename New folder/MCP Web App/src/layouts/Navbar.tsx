const Navbar = () => {
  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-lg font-semibold">MCP System</h1>
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="p-2 rounded hover:bg-gray-700 transition">
          🔔
        </button>

        {/* User Profile (Placeholder for future profile dropdown) */}
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          👤
        </div>
      </div>
    </header>
  );
};

export default Navbar;
