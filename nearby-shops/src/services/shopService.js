export const getNearbyShops = async (lat, lng, radius = 10000) => {
  const query = `
    [out:json];
    node
      ["shop"]
      (around:${radius},${lat},${lng});
    out;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data.elements.map(el => ({
      id: el.id,
      name: el.tags?.name || "Unnamed Shop",
      lat: el.lat,
      lng: el.lon,
      tags: el.tags || {}, // keep all info like type, phone, etc.
    }));
  } catch (err) {
    console.error("Error fetching shops:", err);
    return [];
  }
};
