let map;
let activeMarker = null;
let autocomplete;
let geocoder;
let user_long;
let user_lat;

export function initMap() {
  geocoder = new google.maps.Geocoder();
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("address")
  );

  document.getElementById("search").addEventListener("click", geocodeAddress);

  document
    .getElementById("address")
    .addEventListener("keydown", (e) => e.key === "Enter" && geocodeAddress());
}

function geocodeAddress() {
  const address = document.getElementById("address").value;
  if (!address) return;

  geocoder.geocode({ address }, (results, status) => {
    if (status !== "OK") {
      alert("Geocode failed: " + status);
      return;
    }
    const location = results[0].geometry.location;
    const coords = { lat: location.lat(), lng: location.lng() };

    user_lat = location.lat();
    user_long = location.lng();

    if (!map) {
      document.getElementById("map").style.display = "block";
      map = new google.maps.Map(document.getElementById("map"), {
        center: coords,
        zoom: 16,
      });
    } else {
      map.setCenter(coords);
    }

    if (activeMarker) {
      activeMarker.setMap(null);
    }

    activeMarker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location,
    });
  });
}

window.initMap = initMap;
