// This example creates an Area of Interest
document.querySelector('#create-wc-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();
    var data = $('#wc-aoi').html();

    // createAOI callback will receive data and URL and print to screen
    createAOI(data, function(data, url) {
        var name = data.payload[0]['name'],
            id = data.payload[0]['id'],
            geometry = data.payload[0].geometry;

        // Set the ID and name in localStorage for easy use in later demos
        localStorage.setItem('wc-aoi-id', id);
        localStorage.setItem('wc-aoi-name', name);
        localStorage.setItem('wc-aoi-geometry', JSON.stringify(geometry));

        document.querySelector("#create-wc-aoi-response-name").textContent = name;
        document.querySelector("#create-wc-aoi-response-id").textContent = id;
        document.querySelector("#create-wc-aoi-response-url").textContent = url + "\n\n" + JSON.stringify(data);
    });
});

document.querySelector('#aoi-map-link').addEventListener('click', function(evt) {
  evt.preventDefault();

  // Create the AOI map
  var aoiMap = L.map('aoi-map', {
      keyboard: false,
      attributionControl: false
  }).setView([52, -120], 5);

  var toffset = 3

  mapLocation = './cloud-data/western_canada_t' + toffset + '_geo/{z}/{x}/{y}.png'

  // Set a Mapbox basemap layer so we have some context on where we are in the world
  var layer = L.tileLayer(mapLocation, {tms: true, opacity: 0.7, attribution: ""}).addTo(aoiMap);

 var geoJson = L.geoJson(JSON.parse(localStorage.getItem('wc-aoi-geometry'))).addTo(aoiMap);

});
/*
// This examples queries the Archive/Catalog, restricting by AOI ID
document.querySelector('#catalog-filter-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Expects AOi to have been created
    var aoiId = localStorage.getItem('wc-aoi-id');

    // Query the catalog, including the geometry parameter w/ intersects filter
    // This will ensure all scenes returned intersect with the AOI ID provided
    queryCatalog({ geometry_intersects: aoiId, limit: 0 }, function(data, url) {
        document.querySelector("#catalog-filter-aoi-response").textContent = data.meta.total;
        document.querySelector("#catalog-filter-aoi-url").textContent = url + "\n\n" + JSON.stringify(data.meta);
    });
});
*/
// Get the next Forecast (capture opportunity) for a sensor
$('.next-forecast-for-aoi').on('click', function(evt) {
  evt.preventDefault();

  var $section = $(this).closest('section');
  var sensor = $section.attr('data-sensor');
  var aoiID = localStorage.getItem('wc-aoi-id');
  var $mapId = sensor + 'Map';
  var mapContainer = sensor + 'Map';
  
 // Create the AOI map

  var $mapId = L.map(mapContainer, {
      keyboard: false,
      attributionControl: false
  }).setView([52, -120], 5);

  // method is in sat-tracker-demo.js
  getNextForecastForAOI(aoiID, sensor, function(data, url) {
      if (!data.payload[0]) {
        $('.next-forecast-for-aoi-response', $section).html('Next capture opportunity is > 14 days away.');
        $('.next-forecast-for-aoi-code', $section).html(url);

        return;
      }

      var next = data.payload[0]['first_orbit_point_epoch'];
      var now = moment().utc();
      var hoursToNext = moment(next).diff(now,'hours');
      var nowHourUtc = now.format('H');
      var nextPassUtc = +hoursToNext + +nowHourUtc;

      $('.next-forecast-for-aoi-response', $section).html(nextPassUtc);

     if (nextPassUtc < 3) {
	     nextPassUtc = 3;
	     return;
     }

     if (nextPassUtc >48) {
	     nextPassUtc = 48;
	     return;
     }
//     nextPassUtc = 3;
  mapLocation = './cloud-data/western_canada_t' + nextPassUtc + '_geo/{z}/{x}/{y}.png'

  // Set a Mapbox basemap layer so we have some context on where we are in the world
  var layer = L.tileLayer(mapLocation, {tms: true, opacity: 0.7, attribution: ""}).addTo($mapId); });
 var geoJson = L.geoJson(JSON.parse(localStorage.getItem('wc-aoi-geometry'))).addTo($mapId);

});

// Helper method that actually makes the API request to create an AOI
function createAOI(data, callback) {
    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/consumers/apps/me/aois?api_key=" + apiKey + "&api_secret=" + apiSecret;

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

// Given an AOI ID, get the next capture opportunity (Forecast), given a sensor, for that AOI
function getNextForecastForAOI(aoiID, sensor, callback) {

    var apiKey = localStorage.getItem('apiKey'),
        apiSecret = localStorage.getItem('apiSecret'),
        now = moment().toISOString(),
        // Quick breakdown of this API request:
        // * Sensor is the sensor you're interseted in - theia, oli-tirs, etc. See docs for accepted sensors
        // * geometry_intersects - this is the geometry parameter with the "_intersects" filter applied to it.
        //                         this ensures that the forecasts returned intersect with our AOI ID
        // * epoch_gte - this ensures that the "epoch" (timestamp of the forecast) is "gte" (greater than or
        //               or equal to) the current moment. So, basically, in the future.
        // * sort - how to sort the results. in this case we're sorting by the epoch
        // * limit - we only want the *next* forecast, so limit the results returned to 1
        url = "https://api.urthecast.com/v1/satellite_tracker/sensor_platforms/" + sensor + "/forecasts?api_key=" + apiKey + "&api_secret=" + apiSecret + "&geometry_intersects=" + aoiID + "&epoch_gte=" + now + "&sort=epoch&limit=1";

    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            console.log(data);
            if (callback) callback(data, url);
        }
    });
}

