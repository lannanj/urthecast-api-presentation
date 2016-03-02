$('.how-many-scenes').on('click', function(evt) {
    evt.preventDefault();

    var $section = $(this).closest('section');
    var sensor = $section.attr('data-sensor');

    queryCatalog(['sensor_platform=' + sensor], function(data, url) {
        $('.how-many-scenes-results', $section).html(JSON.stringify(data.meta.total));
        $('.how-many-scenes-url', $section).html(url);
    });
});

$('#how-many-advanced').on('click', function(evt) {
  evt.preventDefault();
  var sensor = $('#how-many-sensors').val();
  var cloudCoverage = $('#how-many-clouds').val();

  queryCatalog(['sensor_platform=' + sensor, 'cloud_coverage_lte=' + cloudCoverage], function(data, url) {
      $('#how-many-advanced-results').html(JSON.stringify(data.meta.total));
      $('#how-many-advanced-url', $section).html(url);
  });
});

// Example to query the catalog and get the most recent Theia scene
document.querySelector('#most-recent-theia-scene').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['platform=iss', 'sort=-acquired', 'limit=1'], function(data, url) {
        var timestamp = data.payload[0]['acquired'];
        document.querySelector("#most-recent-theia-scene-results").textContent = moment(timestamp).fromNow();
        $('#most-recent-theia-scene-url').html(url + "\n\n" + JSON.stringify(data.payload[0]));
    });
});

// Example to query the catalog and get the most recent Landsat8 scene
document.querySelector('#most-recent-landsat-scene').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['platform=landsat-8', 'sort=-acquired', 'limit=1'], function(data, url) {
        var timestamp = data.payload[0]['acquired'];
        document.querySelector("#most-recent-landsat-scene-results").textContent = moment(timestamp).fromNow();
        $('#most-recent-landsat-scene-url').html(url + "\n\n" + JSON.stringify(data.payload[0]));
    });
});

// Helper method to query the catalog, given an arbitrary number of parameters
function queryCatalog(query, callback) {

    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/archive/scenes?api_key=" + apiKey + "&api_secret=" + apiSecret + "&";

    // Iterate over all of the parameters, appending them to the URL
    // Small bug: this appends a trailing & at the end of the URL
    query.forEach(function (item, iterator) {
        console.log(item, iterator);
        url += item + "&";
    });

    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            if (callback) callback(data, url);
        }
    });
}
