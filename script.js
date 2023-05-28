// Leaflet map setup
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Handle form submission
const form = document.getElementById('postcodeForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  calculateDistance();
});

// Calculate distance and display results
function calculateDistance() {
  const currentPostcode = document.getElementById('currentPostcode').value;
  const finalPostcode = document.getElementById('finalPostcode').value;

  // Geocoding API request to convert postcodes to coordinates
  const geocodingUrl = `https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248a8c476f699e547efb29b50f6bd6f5564&text=${currentPostcode},${finalPostcode}`;
  
  axios.get(geocodingUrl)
    .then(function(response) {
      const currentCoordinates = response.data.features[0].geometry.coordinates;
      const finalCoordinates = response.data.features[1].geometry.coordinates;

      // Routing API request to calculate distance and time
      const routingUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY&start=${currentCoordinates[0]},${currentCoordinates[1]}&end=${finalCoordinates[0]},${finalCoordinates[1]}`;

      axios.get(routingUrl)
        .then(function(response) {
          const distance = response.data.features[0].properties.summary.distance;
          const duration = response.data.features[0].properties.summary.duration;
          
          // Display results
          const resultsDiv = document.getElementById('results');
          resultsDiv.innerHTML = `Distance: ${distance.toFixed(2)} meters | Duration: ${duration.toFixed(2)} seconds`;

          // Update map with markers and route
          updateMap(currentCoordinates, finalCoordinates, response.data.features[0].geometry.coordinates);
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Update map with markers and route
function updateMap(start, end, route
