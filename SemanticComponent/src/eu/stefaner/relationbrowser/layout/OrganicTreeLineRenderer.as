﻿package eu.stefaner.relationbrowser.layout
{
  import flare.vis.data.DataSprite;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.render.EdgeRenderer;

  public class OrganicTreeLineRenderer extends EdgeRenderer
  {

    private static var _instance:OrganicTreeLineRenderer = new OrganicTreeLineRenderer();

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

      e.alpha = Math.min(e.source.alpha, e.target.alpha);

      var x1:Number = e.source.x;
      var y1:Number = e.source.y;
      var x2:Number = e.target.x;
      var y2:Number = e.target.y;

      e.graphics.moveTo(x1, y1);

      var len1:Number = Math.sqrt(x1 * x1 + y1 * y1);
      var len2:Number = Math.sqrt(x2 * x2 + y2 * y2);
      var centerx:Number = x1 + (x2 - x1) * .5;
      var centery:Number = y1 + (y2 - y1) * .5;

      var scaleFactor:Number = Math.min(.66, len1 / 50);

      // tree-like
      //graphics.curveTo(x1+(x1/len1)*(len2-len1)*scaleFactor, y1+(y1/len1)*(len2-len1)*scaleFactor, x2, y2);

      // outwards tree-like: better readable (?), but ugly
      // graphics.curveTo(x2-(x1/len1)*(len2-len1)*scaleFactor, y2-(y1/len1)*(len2-len1)*scaleFactor, x2, y2);

      // smooth tangents on both sides:
      e.graphics.curveTo(x1 + (x1 / len1) * (len2 - len1) * scaleFactor * .5,
        y1 + (y1 / len1) * (len2 - len1) * scaleFactor * .5, centerx, centery);
      e.graphics.curveTo(x2 - (x2 / len2) * (len2 - len1) * scaleFactor * .5,
        y2 - (y2 / len2) * (len2 - len1) * scaleFactor * .5, x2, y2);

    //super.render();
    }
  }
}