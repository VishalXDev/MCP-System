import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMapsConfig";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 28.7041, lng: 77.1025 }; // Default: Delhi

const OrderMap = ({ orderLocation }: { orderLocation: { lat: number; lng: number } }) => {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={orderLocation || center} zoom={14}>
        {orderLocation && <Marker position={orderLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default OrderMap;
