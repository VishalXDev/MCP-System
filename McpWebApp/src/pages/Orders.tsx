import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaWallet,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import API from "../utils/axios";
import { autoAssignOrder } from "../services/orderService";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  customer: string;
  status: string;
  total: string;
  location: string;
  assignedPartner?: {
    name: string;
  };
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const ordersPerPage = 5;
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return orders.slice(start, start + ordersPerPage);
  }, [currentPage, orders]);

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get(`/orders?uid=${user.uid}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(
        currentUser
          ? {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
            }
          : null
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAutoAssign = async (orderId: string) => {
    try {
      await autoAssignOrder(orderId);
      toast.success("Order auto-assigned!");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to auto-assign");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Orders
      </h1>

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
                  location.pathname === item.path
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
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
                    <th className="py-4 px-6 text-center">Assigned Partner</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300"
                    >
                      <td className="py-4 px-6 text-left font-medium">
                        {order._id}
                      </td>
                      <td className="py-4 px-6 text-left">{order.customer}</td>
                      <td className="py-4 px-6 text-center">{order.status}</td>
                      <td className="py-4 px-6 text-center font-semibold">
                        {order.total}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {order.assignedPartner?.name || "Unassigned"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleAutoAssign(order._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                          Auto Assign
                        </button>
                      </td>
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
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
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
  );
};

export default Orders;
