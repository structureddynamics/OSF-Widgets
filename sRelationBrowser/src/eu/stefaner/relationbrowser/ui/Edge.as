package eu.stefaner.relationbrowser.ui
{
  import flare.animate.Transitioner;
  import flare.util.Shapes;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.NodeSprite;

  
  import flash.events.MouseEvent;
  import flash.text.TextField;
  
  import mx.controls.ToolTip;
  import mx.managers.ToolTipManager;  

  public class Edge extends EdgeSprite
  {
    public var weight:Number = 1;
    public var type:String = "";
    public var image:SpriteImage;
    public var title_tf:TextField;
    private var tip:ToolTip = null;
    
    public function Edge(source:NodeSprite = null, target:NodeSprite = null, data:Object = null)
    {    
      var directed:Boolean = false;
      
      if(data.skin.directedArrowHead != "none")
      {
        directed = true;
      }
      
      super(source, target, directed);
            
      if(data.skin.image != "")
      {
        image = new SpriteImage(data.skin.image);
        this.addChild(image);
      }
      
      if(data.skin.displayLabel != "")
      {
        title_tf = new TextField();
        addChild(title_tf);
      }      
      
      this.data = data;
      
      /** Handle mouse move over and out of the image; mainly for tooltips display */
      this.addEventListener(MouseEvent.MOUSE_OVER, mouseOverHandler);
      this.addEventListener(MouseEvent.MOUSE_OUT, mouseOutHandler);
      
      mouseChildren = false;
    }
    
    /** This function is called when the mouse button is moving over the image. */
    private function mouseOverHandler(event:MouseEvent):void
    {
      if(!tip && data.skin.tooltipLabel != "")
      {
        var outfit:int = 0;
        if(image)
        {
          outfit = image.width; 
        }
        
        tip = ToolTipManager.createToolTip(data.skin.tooltipLabel, event.stageX + outfit, 
          event.stageY) as ToolTip;
      }
    }
    
    /** This function is called when the mouse button is moving away of the image. */
    private function mouseOutHandler(event:MouseEvent):void
    {
      if(tip && data.skin.tooltipLabel != "")
      {
        ToolTipManager.destroyToolTip(tip); 
        tip= null;
      }
    }        

    public function show(_t:Transitioner):void
    {
      _t.$(this).alpha = 1;
      _t.$(this).visible = true;
      visible = true;
    }
  }
}