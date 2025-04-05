import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaClipboardList, FaWallet, FaCog, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import API from "../utils/axios";

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

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const ordersPerPage = 5;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Fetch Auth User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
      } : null);
    });
    return () => unsubscribe();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    setLoading(true);
    API.get("/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <div className="p-6 max-w-7xl mx-auto">
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
              {user && (
                <li
                  className="mb-4 p-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-red-600"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </li>
              )}
            </ul>
          </aside>

          {/* Main Content */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4 flex-1">
            {loading ? (
              <p className="text-center text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders available.</p>
            ) : (
              <>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-4 px-6 text-left">Order ID</th>
                      <th className="py-4 px-6 text-left">Customer</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300">
                        <td className="py-4 px-6 text-left font-medium">{order.id}</td>
                        <td className="py-4 px-6 text-left">{order.customer}</td>
                        <td className="py-4 px-6 text-center">{order.status}</td>
                        <td className="py-4 px-6 text-center font-semibold">{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Orders;
