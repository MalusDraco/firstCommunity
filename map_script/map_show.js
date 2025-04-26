let map;
let activeMarker = null;

export function createMap(user_lat, user_long) {
  console.log("HELLO");
  const startCoords = { lat: user_lat, lng: user_long };

  map = new google.maps.Map(document.getElementById("map"), {
    center: startCoords,
    zoom: 16,
  });

  activeMarker = new google.maps.Marker({
    position: startCoords,
    map: map,
  });
}
