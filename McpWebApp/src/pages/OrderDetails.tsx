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

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { orderId = "Unknown" } = useParams<{ orderId: string }>();

  // Fallback if no prop passed
  const fetchedOrder: Order = order ?? {
    id: orderId,
    status: "Pending",
    customerName: "Jane Doe",
    location: { lat: 40.7128, lng: -74.006 }, // NYC default
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        📦 Order #{fetchedOrder.id}
      </h2>

      <div className="text-gray-700">
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`inline-block px-2 py-1 rounded text-white text-xs ${
              fetchedOrder.status === "Delivered"
                ? "bg-green-500"
                : fetchedOrder.status === "In Transit"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
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
        <p className="text-gray-500">
          No location data available for this order.
        </p>
      )}
    </div>
  );
};

export default OrderDetails;
