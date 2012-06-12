       
function getWMSMapType(map, baseURL, wmsParams, layerName)
{
  var overlayOptions = {
    getTileUrl: function(coord, zoom){
      var proj = map.getProjection();
      
      var zfactor = Math.pow(2,zoom);
      
      var top = proj.fromPointToLatLng(new google.maps.Point(coord.x*256/zfactor,coord.y*256/zfactor));
      var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x+1)*256/zfactor,(coord.y+1)*256/zfactor));

      var urlResult = baseURL + wmsParams.join("&") + "&bbox=" + top.lat() + "," + top.lng() + "," + bot.lat() + "," + bot.lng();            
     
      return urlResult;
    },

    tileSize: new google.maps.Size(256, 256),
    
    maxZoom: 18,
    
    opacity: 0.5,
    
    name: layerName
  };

  overlayWMS = new google.maps.ImageMapType(overlayOptions);
  
  //map.overlayMapTypes.insertAt(0, overlayWMS);
  
  return(overlayWMS);
}

function loadWMSOverlay(map, baseURL, wmsParams, layerName)
{
  var overlayOptions = {
    getTileUrl: function(coord, zoom){
      var proj = map.getProjection();
      
      var zfactor = Math.pow(2,zoom);
      
      var top = proj.fromPointToLatLng(new google.maps.Point(coord.x*256/zfactor,coord.y*256/zfactor));
      var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x+1)*256/zfactor,(coord.y+1)*256/zfactor));

      var urlResult = baseURL + wmsParams.join("&") + "&bbox=" + top.lat() + "," + top.lng() + "," + bot.lat() + "," + bot.lng();            
     
      return urlResult;
    },

    tileSize: new google.maps.Size(256, 256),
    
    maxZoom: 18,
    
    opacity: 0.5,
    
    name: layerName
  };

  overlayWMS = new google.maps.ImageMapType(overlayOptions);
  
  map.overlayMapTypes.insertAt(0, overlayWMS);
}
