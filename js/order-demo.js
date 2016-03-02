$('#generate-order-command').on('click', function(evt) {
  evt.preventDefault();
  var aoiID = localStorage.getItem('sf-aoi-id');
  var sceneId = 'WivSlyULQz245hGNqPcu0w';
  var orderingCommand = `python order.py ${sceneId} ${aoiID}`;
  $('#order-result').html(orderingCommand);
});
