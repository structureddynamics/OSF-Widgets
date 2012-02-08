package
{
  import com.google.maps.overlays.Polygon;
  import com.google.maps.overlays.PolygonOptions;
  
  public class DataPolygon extends Polygon
  {
    [Bindable]
    public var data:Object;
    
    public function DataPolygon(arg0:Array, arg1:PolygonOptions = null, dataRow:Object = null)
    {
      super(arg0, arg1);
      
      this.data = dataRow;
    }
  }   
}