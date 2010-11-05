package eu.stefaner.relationbrowser.data
{
  public class NodeSkin
  {
    public var type:String = "";
    public var image:String = "";
    public var tooltips:Boolean = true; 
    public var shape:String = "circle";
    public var lineWeight:int = 1;
    public var lineColor:uint = 0xFF000000; 
    public var fillColor:uint = 0xFFAABBCC;
    public var textColor:uint = 0xFF000000;
    public var textFont:String = "Verdana";
    public var textSize:int = 12;
    public var radius:int = 80;
    public var label:String = "";
    public var backgroundScaleFactor:Number = 1.0;
    public var textScaleFactor:Number = 1.0;
    public var textOffsetX:int = -1;
    public var textOffsetY:int = -1;
    public var textMultilines:Boolean = true;
    public var textMaxWidth:int = 256;
    public var textMaxHeight:int = 256;
    public var automaticCentering:Boolean = true;
    
    /**
     * This defines a color to overlay on the central, selected, node of the graph. This overlay
     * is defined by a series of color offsets ranging from -255 to 255. The color is defined by
     * 4 different offsets: [alpha, red, green, blue].
     * 
     * By example, if if have an overlay defined as: [0, 150, -50, 0], this will be traducted
     * by an image where the red color is 150 brighter, and the green color 50 lighter.
     * 
     * This is mainly used if you want to make the central node of your graph brighter 
     * related to others.
     */
    public var selectedNodeColorOverlay:Array = [0, 0, 0, 0];    
    public var overNodeColorOverlay:Array = [0, 0, 0, 0];
    
    public var defaultNode:Boolean = false;
    
    public function NodeSkin(type:String, defaultNode:Boolean = false):void
    {
      this.type = type;
      this.defaultNode = defaultNode;
      
      /** us the end of the URI as the default label for a Skin node */
      var end:int = 0;
      
      end = type.lastIndexOf("#");
      
      if(end == -1)
      {
        end = type.lastIndexOf("/");
      }
      
      if(end > 0)
      {
        label = type.substr(end + 1, (type.length - end));
      }
    }  
  }
}