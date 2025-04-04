import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDatabase, ref, onValue } from "firebase/database";
import L from "leaflet";

// Custom delivery icon for the map
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

interface Order {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
}

type FirebaseOrder = {
  latitude: number;
  longitude: number;
  status: string;
};

const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.7041, 77.1025]); // Default: Delhi

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList: Order[] = Object.entries(data as Record<string, FirebaseOrder>)
          .map(([id, value]) => ({
            id,
            latitude: value.latitude,
            longitude: value.longitude,
            status: value.status,
          }))
          .filter((order) => order.latitude && order.longitude); // Ensure valid coordinates

        setOrders(orderList);

        if (orderList.length > 0) {
          setMapCenter([orderList[0].latitude, orderList[0].longitude]); // Center on first order
        }
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe(); // Proper cleanup
  }, []);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md w-full">
      <h2 className="text-lg font-bold mb-4">Order Tracking</h2>

      <MapContainer center={mapCenter} zoom={10} className="h-96 w-full rounded-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {orders.map((order) => (
          <Marker key={order.id} position={[order.latitude, order.longitude]} icon={deliveryIcon}>
            <Popup>
              <strong>Order ID:</strong> {order.id} <br />
              <strong>Status:</strong> {order.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OrderTracking;
