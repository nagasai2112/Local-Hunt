import { getDistance } from "geolib";

export const calculateDistance = (user, shop) => {
  const distance = getDistance(
    { latitude: user.lat, longitude: user.lng },
    { latitude: shop.lat, longitude: shop.lng }
  );
  return (distance / 1000).toFixed(2); // convert meters → km
};
