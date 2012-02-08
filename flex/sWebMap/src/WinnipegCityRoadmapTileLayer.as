package
{ 
  import com.google.maps.Color;
  import com.google.maps.Copyright;
  import com.google.maps.CopyrightCollection;
  import com.google.maps.LatLng;
  import com.google.maps.LatLngBounds;
  import com.google.maps.TileLayerBase;
  import com.google.maps.interfaces.IMap;
  
  import flash.display.DisplayObject;
  import flash.display.Loader;
  import flash.display.LoaderInfo;
  import flash.display.Sprite;
  import flash.events.*;
  import flash.geom.Point;
  import flash.net.URLRequest;
  
  public class WinnipegCityRoadmapTileLayer extends TileLayerBase 
  {
    private var tileSize:Number;
    
    /**
     * tile layer constructor.
     * @param tileSize  Tile size (same horizontally and vertically).
     */
    public function WinnipegCityRoadmapTileLayer(tileSize:Number) 
    {
      var copyrightCollection:CopyrightCollection = new CopyrightCollection();
      
      super(copyrightCollection, 1, 19);
      
      this.tileSize = tileSize;
      
      // Add a custom copyright that will apply to the entire map layer.
      copyrightCollection.addCopyright(
        new Copyright("City of Winnipeg",
        new LatLngBounds(new LatLng(-90, -180),
        new LatLng(90, 180)),
        0,
        "City of Winnipeg"));
    }
    
    /**
     * Creates and loads a tile (x, y) at the given zoom level.
     * @param tilePos  Tile coordinates.
     * @param zoom  Tile zoom.
     * @return  Display object representing the tile.
     */
    public override function loadTile(tilePos:Point, zoom:Number):DisplayObject 
    {
      var loader:Loader = new Loader();
      
      /*var z:Number = 17 - zoom;*/
      var z:Number = zoom;
      
      var urlRequest:URLRequest = new URLRequest(
        "http://mapapidev.winnipeg.ca/mapapi/getTile.ashx?x=" + tilePos.x + "&y=" +
        tilePos.y + "&zoom=" + z + "&id=716848");
      
      loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
      
      loader.load(urlRequest);
      
      return(loader);
    }
    
    private function ioErrorHandler(event:IOErrorEvent):void 
    {
      trace("ioErrorHandler: " + event);
    }
  }
}
