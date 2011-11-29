package
{
  import com.google.maps.overlays.Polyline;
  import com.google.maps.overlays.PolylineOptions;
  
  public class DataPolyline extends Polyline
  {
    [Bindable]
    public var data:Object;
    
    public function DataPolyline(arg0:Array, arg1:PolylineOptions = null, dataRow:Object = null)
    {
      super(arg0, arg1);
      
      this.data = dataRow;
    }
  }   
}