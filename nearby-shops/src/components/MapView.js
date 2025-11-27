import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { calculateDistance } from "../utils/distance";
import { getNearbyShops } from "../services/shopService";
import Loader from "./Loader";
import ShopList from "./ShopList";

// fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// color palette for markers
const colors = ["#007bff", "#28a745", "#ffcc00", "#ff6600", "#9933ff"];
const createShopIcon = (label, color = "#007bff") =>
  L.divIcon({
    className: "custom-shop-icon",
    html: `
      <div style="
        background:${color};
        color:white;
        padding:4px 6px;
        border-radius:4px;
        font-weight:bold;
        font-size:12px;
        border:1px solid white;
        text-shadow:1px 1px 1px black;
      ">
        ${label}
      </div>
    `,
  });

// --------------------------
// Component for adding shop
// --------------------------
function AddShopMarker({ onAddShop }) {
  useMapEvents({
    click(e) {
      const name = prompt("Enter Shop Name:");
      if (!name) return;
      const type = prompt("Enter Shop Type (e.g. bakery, mobile, grocery):");
      const hours = prompt("Enter Timings (e.g. 9am - 9pm):");

      const newShop = {
        name,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        tags: {
          shop: type || "general",
          opening_hours: hours || "Not specified",
        },
        isLocal: true,
      };
      onAddShop(newShop);
    },
  });
  return null;
}

export default function MapView() {
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [localShops, setLocalShops] = useState([]);
  const [radius, setRadius] = useState(10); // km

  // fetch OSM shops
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);

        const data = await getNearbyShops(loc.lat, loc.lng, 10000);
        const labeled = data.map((shop, i) => ({
          ...shop,
          label: `Shop ${String.fromCharCode(65 + i)}`,
          color: colors[i % colors.length],
        }));
        setShops(labeled);
      },
      (err) => console.error("Location Error:", err)
    );
  }, []);

  if (!userLocation) return <Loader />;

  // combine local + OSM shops and filter by radius
  const allShops = [...shops, ...localShops]
    .map((s) => ({
      ...s,
      distance: parseFloat(calculateDistance(userLocation, s)),
    }))
    .filter((s) => s.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const nearest = allShops[0];

  // add new shop handler
  const handleAddShop = (shop) => {
    shop.label = `Custom ${String.fromCharCode(65 + localShops.length)}`;
    shop.color = "#ff0066";
    setLocalShops((prev) => [...prev, shop]);
  };

  return (
    <>
      {/* Radius control */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        <label>Radius: <b>{radius} km</b></label>
        <br />
        <input
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <p style={{ fontSize: "12px", color: "#555" }}>
          💡 Click anywhere on map to add your own shop
        </p>
      </div>

      {/* Sidebar */}
      <ShopList userLocation={userLocation} shops={allShops} />

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* handle map clicks for new shops */}
        <AddShopMarker onAddShop={handleAddShop} />

        {/* user marker */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* render all shops */}
        {allShops.map((shop, i) => (
          <Marker
            key={i}
            position={[shop.lat, shop.lng]}
            icon={createShopIcon(
              shop.label,
              shop === nearest ? "#ff0000" : shop.color
            )}
          >
            <Popup>
              <div style={{ lineHeight: "1.4" }}>
                <h4 style={{ margin: "0 0 4px" }}>{shop.name}</h4>
                <p style={{ margin: 0 }}>
                  <b>Type:</b> {shop.tags?.shop || "Unknown"} <br />
                  <b>Distance:</b> {shop.distance.toFixed(2)} km <br />
                  {shop.tags?.["opening_hours"] && (
                    <>
                      <b>Timings:</b> {shop.tags["opening_hours"]} <br />
                    </>
                  )}
                  {shop.isLocal && (
                    <span style={{ color: "green" }}>
                      (Added by You ✅)
                    </span>
                  )}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
