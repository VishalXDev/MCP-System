import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMapsConfig";

interface OrderLocation {
  lat: number;
  lng: number;
}

interface OrderMapProps {
  orderLocation?: OrderLocation;
}

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

const defaultCenter: OrderLocation = {
  lat: 28.7041, // Default to Delhi
  lng: 77.1025,
};

const OrderMap: React.FC<OrderMapProps> = ({ orderLocation }) => {
  const center = orderLocation || defaultCenter;

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default OrderMap;
