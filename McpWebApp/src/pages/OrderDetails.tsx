import { useParams } from "react-router-dom";
import OrderMap from "../components/OrderMap";

interface Order {
  id: string;
  status: string;
  customerName: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface OrderDetailsProps {
  order?: Order;
}

const getStatusStyle = (status: string): string => {
  switch (status) {
    case "Delivered":
      return "bg-green-500";
    case "In Transit":
      return "bg-yellow-500";
    case "Pending":
      return "bg-blue-500";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId && !order) {
    return (
      <div className="p-6 text-center text-gray-500">
        ❌ No order data available.
      </div>
    );
  }

  const fetchedOrder: Order = order ?? {
    id: orderId ?? "Unknown",
    status: "Pending",
    customerName: "Jane Doe",
    location: { lat: 40.7128, lng: -74.006 }, // NYC fallback
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        📦 Order #{fetchedOrder.id}
      </h2>

      <div className="text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`inline-block px-2 py-1 rounded text-white text-xs ${getStatusStyle(
              fetchedOrder.status
            )}`}
          >
            {fetchedOrder.status}
          </span>
        </p>
        <p>
          <span className="font-semibold">Customer:</span>{" "}
          {fetchedOrder.customerName}
        </p>
      </div>

      {fetchedOrder.location ? (
        <div className="mt-6">
          <OrderMap orderLocation={fetchedOrder.location} />
        </div>
      ) : (
        <p className="text-gray-500 italic">
          📍 No location data available for this order.
        </p>
      )}
    </div>
  );
};

export default OrderDetails;
