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

$('#scene-metadata').on('click', function(evt) {
  evt.preventDefault();

  var sceneId = $(this).attr('data-scene-id');

  queryCatalog(['id=' + sceneId], function(data, url) {
    var payload = data.payload[0];
    $('#scene-metadata-results').html(JSON.stringify(payload, null, '\t'));
    $('#scene-metadata-url').html(url);
  });
});

$('.most-recent-scene').on('click', function(evt) {
    evt.preventDefault();

    var $section = $(this).closest('section');
    var platform = $section.attr('data-platform');

    queryCatalog(['platform=' + platform, 'sort=-acquired', 'limit=1'], function(data, url) {
      var timestamp = null;
      if (data.payload.length === 0) {
        timestamp = "No data at this time";
      } else {
        timestamp = moment(data.payload[0]['acquired']).fromNow();
      }

      $('.most-recent-scene-results', $section).html(timestamp);
      $('.most-recent-scene-url', $section).html(url);
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
