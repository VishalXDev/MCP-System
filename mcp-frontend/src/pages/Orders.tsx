import { useState, useEffect } from "react";
import { db } from "../firebase/authUtils"; // Firestore Import
import { collection, getDocs } from "firebase/firestore";

interface Order {
  id: string;
  customer: string;
  status: string;
  total?: number;
  deliveryPartner?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orderList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(orderList);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Firestore update logic (if needed)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      // Firestore delete logic (if needed)
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  if (loading) return <p className="text-center text-white">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 border border-gray-700">Customer</th>
              <th className="p-3 border border-gray-700">Status</th>
              <th className="p-3 border border-gray-700">Total</th>
              <th className="p-3 border border-gray-700">Delivery Partner</th>
              <th className="p-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-400">
                  No orders available
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700">
                  <td className="p-3 border border-gray-700">{order.customer}</td>
                  <td className="p-3 border border-gray-700">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-gray-700 p-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3 border border-gray-700">₹{order.total || 0}</td>
                  <td className="p-3 border border-gray-700">{order.deliveryPartner || "N/A"}</td>
                  <td className="p-3 border border-gray-700">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-500 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
