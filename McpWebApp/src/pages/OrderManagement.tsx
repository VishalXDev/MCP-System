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

  // Fetch Orders and Partners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await API.get("/orders");
        const userRes = await API.get("/users");
        const filteredPartners = userRes.data.filter(
          (u: Partner) => u.role === "partner"
        );

        setOrders(orderRes.data);
        setPartners(filteredPartners);
      } catch (err) {
        console.error("Error fetching data:", err);
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
  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
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
      <h1 className="text-2xl font-bold">Order Management</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th>Address</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Assign</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              <td>{order.address}</td>
              <td>{order.status}</td>
              <td>
                {partners.find((p) => p._id === order.assignedTo)?.name || "Unassigned"}
              </td>
              <td>
                <select
                  onChange={(e) => handleAssign(order._id, e.target.value)}
                  value={order.assignedTo || ""}
                  className="border p-1"
                >
                  <option value="">Select</option>
                  {partners.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value as Order["status"])}
                  value={order.status}
                  className="border p-1"
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
    </div>
  );
};

export default OrderManagement;
