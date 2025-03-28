import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="text-xl">Pickup Partner App</h1>
      <div>
        <Link to="/" className="mr-4">Orders</Link>
        <Link to="/wallet">Wallet</Link>
      </div>
    </nav>
  );
};

export default Navbar;
