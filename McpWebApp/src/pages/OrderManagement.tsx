import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import { toast } from "react-toastify";

// Types
type OrderStatus = "pending" | "assigned" | "picked" | "delivered";

interface Order {
  _id: string;
  status: OrderStatus;
  address: string;
  assignedTo?: string;
  createdAt: string;
}

interface Partner {
  _id: string;
  name: string;
  role: "partner";
}

// Status → Color mapping
const statusColor: Record<OrderStatus, string> = {
  pending: "bg-gray-500",
  assigned: "bg-blue-500",
  picked: "bg-yellow-500",
  delivered: "bg-green-500",
};

// Component
const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
        toast.error("Failed to fetch orders or users.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Assign Partner
  const handleAssign = async (orderId: string, partnerId: string) => {
    try {
      setActionLoading(orderId);
      await API.put(`/orders/${orderId}/assign`, { assignedTo: partnerId });
      const updated = await API.get("/orders");
      setOrders(updated.data);
      toast.success("Partner assigned successfully");
    } catch (err) {
      console.error("Error assigning partner:", err);
      toast.error("Failed to assign partner.");
    } finally {
      setActionLoading(null);
    }
  };

  // Update Status
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setActionLoading(orderId);
      await API.put(`/orders/${orderId}`, { status: newStatus });
      const updated = await API.get("/orders");
      setOrders(updated.data);
      toast.success("Order status updated");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update order status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📋 Order Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
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
                <th className="p-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.address}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {partners.find((p) => p._id === order.assignedTo)?.name ||
                      "Unassigned"}
                  </td>
                  <td className="p-3">
                    <select
                      onChange={(e) => handleAssign(order._id, e.target.value)}
                      value={order.assignedTo || ""}
                      className="border px-2 py-1 rounded"
                      disabled={actionLoading === order._id}
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
                          e.target.value as OrderStatus
                        )
                      }
                      value={order.status}
                      className="border px-2 py-1 rounded"
                      disabled={actionLoading === order._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="picked">Picked</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
