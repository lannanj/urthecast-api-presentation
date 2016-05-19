$('.how-many-scenes').on('click', function(evt) {
    evt.preventDefault();

    var $section = $(this).closest('section');
    var sensor = $section.attr('data-sensor');

    queryCatalog({ sensor_platform: sensor, limit: 0 }, function(data, url) {
        $('.how-many-scenes-results', $section).html(JSON.stringify(data.meta.total));
        $('.how-many-scenes-url', $section).html(url);
    });
});

$('#how-many-advanced').on('click', function(evt) {
  evt.preventDefault();

  var $section = $(this).closest('section');
  var sensor = $('#how-many-sensors').val();
  var cloudCoverage = $('#how-many-clouds').val();

  queryCatalog({ sensor_platform: sensor, cloud_coverage_lte: cloudCoverage, limit: 0 }, function(data, url) {
      $('#how-many-advanced-results').html(JSON.stringify(data.meta.total));
      $('#how-many-advanced-url', $section).html(url);
  });
});

$('#scene-metadata').on('click', function(evt) {
  evt.preventDefault();

  var sceneId = $(this).attr('data-scene-id');

  queryCatalog({ id: sceneId }, function(data, url) {
    var payload = data.payload[0];
    $('#scene-metadata-results').html(JSON.stringify(payload, null, 4));
    $('#scene-metadata-url').html(url);
  });
});

$('.most-recent-scene').on('click', function(evt) {
    evt.preventDefault();

    var $section = $(this).closest('section');
    var platform = $section.attr('data-platform');

    queryCatalog({ platform: platform, sort: '-acquired', limit: 1 }, function(data, url) {
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
function queryCatalog(params, callback) {

    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/archive/scenes?api_key=" + apiKey + "&api_secret=" + apiSecret;

    $.ajax({
        type: "GET",
        url: url,
        data: params,
        success: function (data) {
            if (callback) callback(data, this.url);
        }
    });
}

