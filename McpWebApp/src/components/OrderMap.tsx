import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMapsConfig";

interface OrderLocation {
  lat: number;
  lng: number;
}

interface OrderMapProps {
  orderLocation?: OrderLocation; // Optional prop
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.7041, lng: 77.1025 }; // Fallback to Delhi

const OrderMap: React.FC<OrderMapProps> = ({ orderLocation }) => {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={orderLocation || defaultCenter}
        zoom={14}
      >
        {orderLocation && <Marker position={orderLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default OrderMap;
