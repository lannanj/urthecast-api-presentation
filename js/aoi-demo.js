// This example creates an Area of Interest
document.querySelector('#create-sf-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();
    var data = $('#sf-aoi').html();

    // createAOI callback will receive data and URL and print to screen
    createAOI(data, function(data, url) {
        var name = data.payload[0]['name'],
            id = data.payload[0]['id'],
            geometry = data.payload[0].geometry;

        // Set the ID and name in localStorage for easy use in later demos
        localStorage.setItem('sf-aoi-id', id);
        localStorage.setItem('sf-aoi-name', name);
        localStorage.setItem('sf-aoi-geometry', JSON.stringify(geometry));

        document.querySelector("#create-sf-aoi-response-name").textContent = name;
        document.querySelector("#create-sf-aoi-response-id").textContent = id;
        document.querySelector("#create-sf-aoi-response-url").textContent = url + "\n\n" + JSON.stringify(data);
    });
});

document.querySelector('#aoi-map-link').addEventListener('click', function(evt) {
  evt.preventDefault();

  // Create the AOI map
  var aoiMap = L.map('aoi-map', {
      keyboard: false,
      attributionControl: false
  }).setView([38.7386, -121.7299], 8);

  // Set a Mapbox basemap layer so we have some context on where we are in the world
  var layer = L.tileLayer('http://api.mapbox.com/v4/urthecast2.ipog0aj7/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoidXJ0aGVjYXN0MiIsImEiOiJKM1pwMnFZIn0.ReeiMLJtH18oqVeto7KyZw').addTo(aoiMap);

  var geoJson = L.geoJson(JSON.parse(localStorage.getItem('sf-aoi-geometry'))).addTo(aoiMap);

  setTimeout(function() {
    aoiMap.fitBounds(geoJson);
  }, 5);
});

// This examples queries the Archive/Catalog, restricting by AOI ID
document.querySelector('#catalog-filter-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Expects AOi to have been created
    var aoiId = localStorage.getItem('sf-aoi-id');

    // Query the catalog, including the geometry parameter w/ intersects filter
    // This will ensure all scenes returned intersect with the AOI ID provided
    queryCatalog(['geometry_intersects=' + aoiId], function(data, url) {
        document.querySelector("#catalog-filter-aoi-response").textContent = data.meta.total;
        document.querySelector("#catalog-filter-aoi-url").textContent = url + "\n\n" + JSON.stringify(data.meta);
    });
});

// Get the next Forecast (capture opportunity) for a sensor
$('.next-forecast-for-aoi').on('click', function(evt) {
  evt.preventDefault();

  var $section = $(this).closest('section');
  var sensor = $section.attr('data-sensor');
  var aoiID = localStorage.getItem('sf-aoi-id');

  // method is in sat-tracker-demo.js
  getNextForecastForAOI(aoiID, sensor, function(data, url) {
      if (!data.payload[0]) {
        $('.next-forecast-for-aoi-response', $section).html('Next capture opportunity is > 14 days away.');
        $('.next-forecast-for-aoi-code', $section).html(url);

        return;
      }

      var next = data.payload[0]['first_orbit_point_epoch'];

      $('.next-forecast-for-aoi-response', $section).html(moment(next).fromNow());
      $('.next-forecast-for-aoi-code', $section).html(url);
  });

});

// Helper method that actually makes the API request to create an AOI
function createAOI(data, callback) {
    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/consumers/apps/me/aois?api_key=" + apiKey + "&api_secret=" + apiSecret + "&";

    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: data,
        success: function (data) {
            console.log(data);
            if (callback) callback(data, url);
        }
    });
}
