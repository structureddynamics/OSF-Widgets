package eu.stefaner.relationbrowser.layout
{
  import flare.vis.data.DataSprite;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.render.EdgeRenderer;

  public class CurvedLineRenderer extends EdgeRenderer
  {

    //--------------------------------------
    // CONSTRUCTOR
    //--------------------------------------

    /**
     *	@Constructor
     */
    private static var _instance:CurvedLineRenderer = new CurvedLineRenderer();

    /** Static EdgeRenderer instance. */
    public static function get instance():EdgeRenderer
    {
      return _instance;
    }

    /** @inheritDoc */
    override public function render(d:DataSprite):void
    {

      var e:EdgeSprite = d as EdgeSprite;

      e.graphics.clear();

      setLineStyle(e, e.graphics);
      // e.graphics.lineStyle(3*.5*(e.source.alpha+e.target.alpha), 0xFFFFFF, .5*e.source.scaleX*e.target.scaleX);
      var diffX:Number = (e.target.x - e.source.x);
      var diffY:Number = (e.target.y - e.source.y);

      var centerX:Number = e.source.x + diffX * .5;
      var centerY:Number = e.source.y + diffY * .5;

      var length:Number = Math.sqrt(diffX * diffX + diffY * diffY);
      e.graphics.moveTo(e.source.x, e.source.y);
      e.graphics.curveTo(centerX * 1.33, centerY * 1.33, e.target.x, e.target.y);
    //e.graphics.curveTo(centerX + 30 * diffY / length, centerY - 30 * diffX / length, e.target.x, e.target.y);
    }
  }
}