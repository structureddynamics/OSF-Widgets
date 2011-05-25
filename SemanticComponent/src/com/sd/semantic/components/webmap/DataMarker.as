package com.sd.semantic.components.webmap
{
  import com.google.maps.overlays.Marker;
  import com.google.maps.overlays.MarkerOptions;
  import com.google.maps.LatLng;
  
  public class DataMarker extends Marker
  {
    [Bindable]
    public var data:Object;
    
    public function DataMarker(arg0:LatLng, arg1:MarkerOptions = null, dataRow:Object = null)
    {
      super(arg0, arg1);
      
      this.data = dataRow;
    }
  }   
}