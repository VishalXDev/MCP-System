import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaClipboardList, FaWallet, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
  location: string;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const AuthContext = createContext<{ user: User | null } | null>(null);

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const ordersPerPage = 5;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName } : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data: Order[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleCancelOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <AuthContext.Provider value={{ user }}>
      <div className="p-6 animate-fadeIn max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">Orders</h1>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white h-screen p-5 hidden sm:block">
            <ul>
              {[
                { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
                { name: "Orders", path: "/orders", icon: <FaClipboardList /> },
                { name: "Wallet", path: "/wallet", icon: <FaWallet /> },
                { name: "Settings", path: "/settings", icon: <FaCog /> },
              ].map((item) => (
                <li
                  key={item.name}
                  className={`mb-4 p-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-all ${
                    location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </li>
              ))}
              {user ? (
                <li
                  className="mb-4 p-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-red-600"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </li>
              ) : (
                <>
                  <li
                    className="mb-4 p-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-blue-600"
                    onClick={() => navigate("/login")}
                  >
                    <FaUser />
                    <span>Login</span>
                  </li>
                  <li
                    className="mb-4 p-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-green-600"
                    onClick={() => navigate("/signup")}
                  >
                    <FaUser />
                    <span>Signup</span>
                  </li>
                </>
              )}
            </ul>
          </aside>

          {/* Main Content */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4 flex-1">
            {loading ? (
              <p className="text-center text-gray-600">Loading orders...</p>
            ) : (
              <>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-4 px-6 text-left">Order ID</th>
                      <th className="py-4 px-6 text-left">Customer</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Total</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300">
                        <td className="py-4 px-6 text-left font-medium">{order.id}</td>
                        <td className="py-4 px-6 text-left">{order.customer}</td>
                        <td className="py-4 px-6 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-center font-semibold">{order.total}</td>
                        <td className="py-4 px-6 text-center flex justify-center space-x-2">
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg">
                            View
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};
import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders()
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load orders');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Orders</h1>
            {orders.map(order => (
                <p key={order._id}>{order.productName}</p>
            ))}
        </div>
    );
};

export default Orders;
