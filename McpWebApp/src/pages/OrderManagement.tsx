import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Define Order Type
interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "Pending" | "Completed" | "Cancelled";
  assignedTo?: string;
}

// Define Pickup Partner Type
interface PickupPartner {
  id: string;
  name: string;
  role: string; // Fix for 'role' does not exist error
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pickupPartners, setPickupPartners] = useState<PickupPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const ordersSnap = await getDocs(ordersRef);
        const ordersList = ordersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersList);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      }
    };

    // Fetch Pickup Partners
    const fetchPickupPartners = async () => {
      try {
        const partnersRef = collection(db, "users"); // Assuming pickup partners are in 'users'
        const partnersSnap = await getDocs(partnersRef);
        const partnersList: PickupPartner[] = partnersSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as PickupPartner)) // Fix for role error
          .filter((user) => user.role === "pickup-partner"); // Only get partners

        setPickupPartners(partnersList);
      } catch (err) {
        console.error("Error fetching pickup partners:", err);
      }
    };

    fetchOrders();
    fetchPickupPartners();
    setLoading(false);
  }, []);

  // Update Order Status
  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Assign Pickup Partner
  const assignPickupPartner = async (orderId: string, partnerId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { assignedTo: partnerId });

      // Update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, assignedTo: partnerId } : order
        )
      );
    } catch (err) {
      console.error("Error assigning pickup partner:", err);
    }
  };

  // Delete Order
  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Customer</th>
            <th className="border p-3 text-left">Amount</th>
            <th className="border p-3 text-left">Status</th>
            <th className="border p-3 text-left">Pickup Partner</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border">
              <td className="border p-3">{order.customer}</td>
              <td className="border p-3">₹{order.amount.toLocaleString()}</td>
              <td className="border p-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                  className="p-1 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              {/* Assign Pickup Partner Dropdown */}
              <td className="border p-3">
                <select
                  value={order.assignedTo || ""}
                  onChange={(e) => assignPickupPartner(order.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="">Unassigned</option>
                  {pickupPartners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-3">
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
