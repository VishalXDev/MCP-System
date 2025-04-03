import { useParams } from "react-router-dom";
import OrderMap from "../components/OrderMap";

interface Order {
  id: string;
  status: string;
  customerName: string;
  location?: { lat: number; lng: number };
}

interface OrderDetailsProps {
  order?: Order; // ✅ Made optional to prevent errors
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { orderId } = useParams(); // Get orderId from URL

  // If order is not provided, fetch details (Mock API Call)
  const fetchedOrder: Order = order || {
    id: orderId || "Unknown",
    status: "Pending",
    customerName: "Jane Doe",
    location: { lat: 40.7128, lng: -74.006 },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Order #{fetchedOrder.id}</h2>
      <p><strong>Status:</strong> {fetchedOrder.status}</p>
      <p><strong>Customer:</strong> {fetchedOrder.customerName}</p>

      {/* Show Order Map if location is available */}
      {fetchedOrder.location && <OrderMap orderLocation={fetchedOrder.location} />}
    </div>
  );
};

export default OrderDetails;
