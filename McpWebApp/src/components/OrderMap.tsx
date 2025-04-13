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

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter: OrderLocation = {
  lat: 28.7041, // Delhi default
  lng: 77.1025,
};

const OrderMap: React.FC<OrderMapProps> = ({ orderLocation }) => {
  const center: google.maps.LatLngLiteral = orderLocation || defaultCenter;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default OrderMap;
