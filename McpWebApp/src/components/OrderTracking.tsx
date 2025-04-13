import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDatabase, ref, onValue } from "firebase/database";
import L from "leaflet";

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

interface Order {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface FirebaseOrder {
  latitude: number;
  longitude: number;
  status: string;
}

const FitBounds = ({ orders }: { orders: Order[] }) => {
  const map = useMap();

  useEffect(() => {
    if (orders.length > 1) {
      const bounds = L.latLngBounds(orders.map(o => [o.latitude, o.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (orders.length === 1) {
      map.setView([orders[0].latitude, orders[0].longitude], 14);
    }
  }, [orders, map]);

  return null;
};

const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const defaultCenter: [number, number] = [28.7041, 77.1025]; // Delhi

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, "orders");

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const orderList: Order[] = Object.entries(data as Record<string, FirebaseOrder>)
            .map(([id, value]) => ({
              id,
              latitude: value.latitude,
              longitude: value.longitude,
              status: value.status,
            }))
            .filter(
              (order) =>
                typeof order.latitude === "number" &&
                typeof order.longitude === "number"
            );
          setOrders(orderList);
        } else {
          setOrders([]);
        }
      },
      (error) => {
        console.error("Firebase order fetch error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md w-full">
      <h2 className="text-lg font-bold mb-4">Order Tracking</h2>

      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom
        className="h-96 w-full rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds orders={orders} />

        {orders.map((order) => (
          <Marker
            key={order.id}
            position={[order.latitude, order.longitude]}
            icon={deliveryIcon}
          >
            <Popup>
              <div className="text-sm">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {orders.length === 0 && (
        <p className="text-center text-gray-300 mt-4">No active orders to track.</p>
      )}
    </div>
  );
};

export default OrderTracking;
