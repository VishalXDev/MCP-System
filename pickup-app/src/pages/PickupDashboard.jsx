import { useEffect, useState } from "react";
import axios from "axios";

function PickupDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Pickup Dashboard</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>Order Status: {order.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default PickupDashboard;
