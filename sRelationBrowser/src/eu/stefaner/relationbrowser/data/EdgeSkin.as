package eu.stefaner.relationbrowser.data
{
  public class EdgeSkin
  {
    public var type:String = "";
    public var image:String = "";
    public var lineWeight:int = 1;
    public var lineColor:uint = 0xFF000000; 
    public var textColor:uint = 0xFF000000;
    public var textFont:String = "Verdana";
    public var textSize:int = 12;
    public var directedArrowHead:String = "arrow";
    public var tooltipLabel:String = "";
    public var displayLabel:String = "";
    
    public function EdgeSkin(type:String):void
    {
      this.type = type;
    }  
  }
}