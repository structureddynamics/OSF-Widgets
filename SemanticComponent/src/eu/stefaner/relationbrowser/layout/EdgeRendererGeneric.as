package eu.stefaner.relationbrowser.layout
{
  import eu.stefaner.relationbrowser.ui.Node;
  
  import flare.util.Shapes;
  import flare.vis.data.DataSprite;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.NodeSprite;
  import flare.vis.data.render.ArrowType;
  import flare.vis.data.render.EdgeRenderer;
  
  import flash.display.Graphics;
  import flash.geom.Point;
  
  import flash.text.TextField;  
  import flash.text.TextFormat;  

  /**
   * @author mo
   */
  public class EdgeRendererGeneric extends EdgeRenderer
  {

    private static const ROOT3:Number = Math.sqrt(3);

    public function EdgeRendererGeneric()
    {
    }

    private static var _instance:EdgeRendererGeneric = new EdgeRendererGeneric();

    /** Static EdgeRenderer instance. */
    public static function get instance():EdgeRendererGeneric
    {
      return _instance;
    }

    // temporary variables
    private var _p:Point = new Point(), _q:Point = new Point();
    private var _pts:Array = new Array(20);

    /** @inheritDoc */
    override public function render(d:DataSprite):void
    {
      /** Edge sprite to render */
      var e:EdgeSprite = d as EdgeSprite;

      if(e == null)
      {
        return;
      } // TODO: throw exception?
      
      /** Source node */
      var s:NodeSprite = e.source;
      
      /** Target node */
      var t:NodeSprite = e.target;
      
      /** Graphics */
      var g:Graphics = e.graphics;

      var ctrls:Array = e.points as Array;
      
      /** Starting X position of the arc */
      var x1:Number = e.x1;
      
      /** Starting Y position of the arc */
      var y1:Number = e.y1;
      
      /** Ending X position of the arc */
      var x2:Number = e.x2;
      
      /**Ending Y position of the arc */
      var y2:Number = e.y2;

      var xL:Number = ctrls == null ? x1 : ctrls[ctrls.length - 2];
      var yL:Number = ctrls == null ? y1 : ctrls[ctrls.length - 1];
      var dx:Number, dy:Number, dd:Number;
      
      /** Shape of the edge being rendered */
      var edgeShape:String = Shapes.LINE;

      // cuvred lines for outer edges: should be configurable!
      var isOuterEdge:Boolean = t.props.distance == 2 || s.props.distance == 2;

      // disabled for now...
      //			var isOuterEdge : Boolean = false;

      // modify end points as needed to accomodate arrow
      if(e.arrowType != ArrowType.NONE && !isOuterEdge && e.directed)
      {
        // determine arrow head size
        
        /** Arrow Heigh */
        var ah:Number = e.arrowHeight;
        
        /** Arrow Width */
        var aw:Number = e.arrowWidth / 2;

        if(ah < 0 && aw < 0)
        {
          aw = 1.5 * e.lineWidth;
        }

        if(ah < 0)
        {
          ah = ROOT3 * aw;
        }

        else if(aw < 0)
        {
          aw = ah / ROOT3;
        }

        // temp endpoint
        _p.x = x2;
        _p.y = y2;

        // get unit vector along arrow line
        dx = _p.x - xL;
        dy = _p.y - yL;
        dd = Math.sqrt(dx * dx + dy * dy);
        dx /= dd;
        dy /= dd;

        // look for edge radius property, otherwsie use half width
        
        /** Target node radius */
        var tRad:Number;

        if(t is Node)
        {
          tRad = (t as Node).edgeRadius;
        }
        else
        {
          tRad = t.width * .5;
        }

        /** Source node radius */
        var sRad:Number;

        if(s is Node)
        {
          sRad = (s as Node).edgeRadius;
        }

        else
        {
          sRad = s.width * .5;
        }

        // move endpoint half the width of target node to center
        _p.x -= tRad * dx;
        _p.y -= tRad * dy;

        // move startpoint half the width of source node to center
        
        /** 
        * sRad + 3 is used to offset the starting possition of the arc by 3 pixel. That way, if
        * directed arcs are supperposed, the arc's length won't go above the arrow's head.
        */
        
        x1 += (sRad + 3) * dx;
        y1 += (sRad + 3) * dy;

        // set final point positions
        var dd2:Number = e.lineWidth / 2;

        // if drawing as lines, offset arrow tip by half the line width
        if(e.arrowType == ArrowType.LINES)
        {
          _p.x -= dd2 * dx;
          _p.y -= dd2 * dy;
          dd2 += e.lineWidth;
        }
        // offset the anchor point (the end point for the edge connector)
        // so that edge doesn't "overshoot" the arrow head
        dd2 = ah - dd2;
        x2 = _p.x - dd2 * dx;
        y2 = _p.y - dd2 * dy;
      }
      else
      {
        // just do edge radius thing

        // temp endpoint
        _p.x = x2;
        _p.y = y2;

        // get unit vector along arrow line
        dx = _p.x - xL;
        dy = _p.y - yL;
        dd = Math.sqrt(dx * dx + dy * dy);
        dx /= dd;
        dy /= dd;

        // look for edge radius property, otherwsie use half width
        //				var tRad : Number;
        if(t is Node)
        {
          tRad = (t as Node).edgeRadius;
        }

        else
        {
          tRad = t.width * .5;
        }

        //				var sRad : Number;
        if(s is Node)
        {
          sRad = (s as Node).edgeRadius;
        }

        else
        {
          sRad = s.width * .5;
        }

        // move startpoint half the width of source node to center
        x1 += sRad * dx;
        y1 += sRad * dy;

        // move endpoint half the width of target node to center
        x2 -= tRad * dx;
        y2 -= tRad * dy;
      }

      // insert curve
      if(isOuterEdge)
      {
        var diffX:Number = x2 - x1;
        var diffY:Number = y2 - y1;
        var scaleFactor:Number = 1 + (Math.sqrt(diffX * diffX + diffY * diffY) / 800);
        ctrls =
          [
          scaleFactor * (x1 + diffX * .5),
          scaleFactor * (y1 + diffY * .5)
          ];
      }

      else
      {
        ctrls = null;
      }

      if(e.props.isBidirectional)
      {
        x1 = x1 + (x2 - x1) * .5;
        y1 = y1 + (y2 - y1) * .5;
      }

      // draw the edge
      g.clear();          // clear it out
      setLineStyle(e, g); // set the line style
      g.moveTo(x1, y1);

      if(ctrls != null)
      {
        edgeShape = Shapes.BEZIER;        
        g.curveTo(ctrls[0], ctrls[1], x2, y2);
      }
      else
      {
        edgeShape = Shapes.LINE;
        g.lineTo(x2, y2);
      }

      // draw an arrow
      if(e.arrowType != ArrowType.NONE && !isOuterEdge && e.directed)
      {
        // get other arrow points
        x1 = _p.x - ah * dx + aw * dy;
        y1 = _p.y - ah * dy - aw * dx;
        x2 = _p.x - ah * dx - aw * dy;
        y2 = _p.y - ah * dy + aw * dx;

        if(e.arrowType == ArrowType.TRIANGLE)
        {
          g.lineStyle();
          g.moveTo(_p.x, _p.y);
          g.beginFill(e.lineColor, e.lineAlpha);
          g.lineTo(x1, y1);
          g.lineTo(x2, y2);
          g.endFill();
        }
        else if(e.arrowType == ArrowType.LINES)
        {
          g.moveTo(x1, y1);
          g.lineTo(_p.x, _p.y);
          g.lineTo(x2, y2);
        }
      }

      /** 
      * Only draw the edge image for line edge.
      * Note: the renderer could be extended to enable this for non-line shapes
      */
      if(e.image)
      {
        if(edgeShape == Shapes.LINE)
        {
          e.image.visible = true;
          e.image.alpha = 1;
          
          e.image.x = (e.x1 + ((e.x2 - e.x1) / 2));
          e.image.y = (e.y1 + ((e.y2 - e.y1) / 2));
        }
        else
        {
          e.image.visible = false;
          e.image.alpha = 0;
        }
      }       
      
      /** Render the possible text to display above the edge. */
      if(e.title_tf && e.data.skin.displayLabel != "")
      {
        if(edgeShape == Shapes.LINE)
        {
          e.title_tf.visible = true;
          e.title_tf.alpha = 1;                  
          
          e.title_tf.text = String(e.data.skin.displayLabel).split(" ").join("\n");
          e.title_tf.textColor = e.data.skin.textColor;
          
          titleFormat = new TextFormat();
          titleFormat.font = e.data.skin.textFont;
          titleFormat.align = "center";
          titleFormat.size = e.data.skin.textSize;
          e.title_tf.setTextFormat(titleFormat);        
          
          /** Adjust title field size */
          e.title_tf.width = Math.min(e.title_tf.textWidth + 10, 100);
          e.title_tf.height = Math.min(e.title_tf.textHeight + 5, 100);
          e.title_tf.x = (e.x1 + (((e.x2 - e.x1) / 2) - (e.title_tf.width / 2)));
          e.title_tf.y = (e.y1 + (((e.y2 - e.y1) / 2) - (e.title_tf.height / 2))); 
        }
        else
        {
          e.title_tf.visible = false;
          e.title_tf.alpha = 0;          
        }
      }
    }     
  }
}