import React, { useState, useEffect } from "react";
import API from "../utils/axios.ts";

// Types
interface Order {
  _id: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  address: string;
  assignedTo?: string;
  createdAt: string;
}

interface Partner {
  _id: string;
  name: string;
  role: "partner";
}

// Component
const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Orders and Partners
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, userRes] = await Promise.all([
          API.get("/orders"),
          API.get("/users"),
        ]);

        const filteredPartners = userRes.data.filter(
          (u: Partner) => u.role === "partner"
        );

        setOrders(orderRes.data);
        setPartners(filteredPartners);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Assign Partner
  const handleAssign = async (orderId: string, partnerId: string) => {
    try {
      await API.put(`/orders/${orderId}/assign`, { assignedTo: partnerId });
      const updated = await API.get("/orders");
      setOrders(updated.data);
    } catch (err) {
      console.error("Error assigning partner:", err);
    }
  };

  // Update Status
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      const updated = await API.get("/orders");
      setOrders(updated.data);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📋 Order Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-left">Assign</th>
                <th className="p-3 text-left">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.address}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        order.status === "pending"
                          ? "bg-gray-500"
                          : order.status === "assigned"
                          ? "bg-blue-500"
                          : order.status === "picked"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {
                      partners.find((p) => p._id === order.assignedTo)?.name ||
                      "Unassigned"
                    }
                  </td>
                  <td className="p-3">
                    <select
                      onChange={(e) =>
                        handleAssign(order._id, e.target.value)
                      }
                      value={order.assignedTo || ""}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Select Partner</option>
                      {partners.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      onChange={(e) =>
                        handleStatusUpdate(
                          order._id,
                          e.target.value as Order["status"]
                        )
                      }
                      value={order.status}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="picked">Picked</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-center py-4 text-gray-500">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
