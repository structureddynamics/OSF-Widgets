package eu.stefaner.flareextensions.render
{
  import flare.vis.data.DataSprite;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.render.ShapeRenderer;
  
  /**
   * @author mo
   */
  public class StairStepEdgeRenderer extends ShapeRenderer
  {
    
    private static var _instance:StairStepEdgeRenderer = new StairStepEdgeRenderer();
    
    /** Static ShapeRenderer instance. */
    public static function get instance():StairStepEdgeRenderer
    {
      return _instance;
    }
    
    public function StairStepEdgeRenderer(defaultSize:Number = 6)
    {
      super(defaultSize);
    }
    
    override public function render(s:DataSprite):void
    {
      var d:EdgeSprite = s as EdgeSprite;
      d.graphics.clear();
      
      if(d.source == null || d.target == null || !d.source.visible || !d.target.visible)
      {
        return;
      }
      
      d.alpha = Math.min(d.source.alpha, d.target.alpha);
      
      
      var nbSteps = 10;
      
      
      var x1:Number = d.source.x;
      var y1:Number = d.source.y;
      var x2:Number = d.target.x;
      var y2:Number = d.target.y;
      
      d.graphics.lineStyle(0, d.lineColor, d.lineAlpha);
      d.graphics.moveTo(x1, y1);
      
      if((x1 - x2) == 0 || (y1 - y2) == 0)
      {
        /** It is a straight line */
        
        if(Math.abs(x1 - x2) != 0)
        {
          var length:int = Math.abs(x1 - x2);
          var stepSize:Number = length / nbSteps;
          
          var distanceX:Number = stepSize / 2;
          var distanceY:Number = Math.tan(45) * distanceX;
          
//          var stepLength:Number = Math.sin(45) * stepSize;
         
          var xStepIterator:int = 1;
          for(var i = 0; i < nbSteps; i++)
          {
            d.graphics.lineTo(x1 + (distanceX * xStepIterator), y1 - distanceY);
            xStepIterator++;
            d.graphics.lineTo(x1 + (distanceX * xStepIterator), y1);
            xStepIterator++;
            d.graphics.lineTo(x1 + (distanceX * xStepIterator), y1 + distanceY);
            xStepIterator++;
            d.graphics.lineTo(x1 + (distanceX * xStepIterator), y1);
            xStepIterator++;
          }          
        }
        
      }
      
      
     /*
      
      var len1:Number = Math.sqrt(x1 * x1 + y1 * y1);
      var len2:Number = Math.sqrt(x2 * x2 + y2 * y2);
      var centerx:Number = x1 + (x2 - x1) * .5;
      var centery:Number = y1 + (y2 - y1) * .5;
      
      var scaleFactor:Number = Math.min(.5, len1 / 100);
      
      // tree-like
      //graphics.curveTo(x1+(x1/len1)*(len2-len1)*scaleFactor, y1+(y1/len1)*(len2-len1)*scaleFactor, x2, y2);
      
      // outwards tree-like: better readable (?), but ugly
      // graphics.curveTo(x2-(x1/len1)*(len2-len1)*scaleFactor, y2-(y1/len1)*(len2-len1)*scaleFactor, x2, y2);
      
      // smooth tangents on both sides:
      d.graphics.curveTo(x1 + (x1 / len1) * (len2 - len1) * scaleFactor * .5,
        y1 + (y1 / len1) * (len2 - len1) * scaleFactor * .5, centerx, centery);
      d.graphics.curveTo(x2 - (x2 / len2) * (len2 - len1) * scaleFactor * .5,
        y2 - (y2 / len2) * (len2 - len1) * scaleFactor * .5, x2, y2);*/
    }
  }
}