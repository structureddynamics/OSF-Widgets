package eu.stefaner.flareextensions.layout
{
  import flare.animate.Transitioner;
  import flare.vis.data.NodeSprite;
  import flare.vis.operator.layout.Layout;

  import flash.geom.Rectangle;

  public class TileLayout extends Layout
  {

    public var margin:int;
    public var layoutMode:int = 2;
    public static var FIXED_WIDTH:int = 1;
    public static var SCALE_TO_FIXED_WIDTH:int = 2;
    public static var FIXED_HEIGHT:int = 3;
    public static var SCALE_TO_FIXED_HEIGHT:int = 4;
    public static var SCALE_TO_FIXED_SIZE:int = 5;
    public var defaultWidth:Number;
    public var defaultHeight:Number;

    public function TileLayout(layoutMode:int = 2, margin:int = 2, defaultWidth:Number = 100,
      defaultHeight:Number = 50):void
    {
      this.margin = margin;
      this.layoutMode = layoutMode;
      layoutBounds = new Rectangle();
      this.defaultWidth = defaultWidth;
      this.defaultHeight = defaultHeight;
      super();
    }

    override public function operate(t:Transitioner = null):void
    {
      if(t == null)t = Transitioner.DEFAULT;

      // Count number of visible items
      var numItems:int = visualization.data.nodes.length;
      // assumption: all sprites have the same dimensions!
      var w:Number = defaultWidth;
      var h:Number = defaultHeight;

      layoutBounds = new Rectangle(0, 0, visualization.bounds.width, visualization.bounds.height);

      var numCols:int = 100000;
      var numRows:int = 100000;
      var colWidth:Number = w + margin;
      var rowHeight:Number = h + margin;
      var scaleFactor:Number = 1;

      // TODO:
      // THIS IS PRETTY MUCH UNTESTED!
      switch (layoutMode)
      {
        case FIXED_WIDTH:

          numCols = Math.floor(layoutBounds.width / colWidth);
          numRows = Math.ceil(numItems / numCols);
        break;
        case SCALE_TO_FIXED_WIDTH:
          // TODO
          numCols = Math.max(1, Math.round(layoutBounds.width / colWidth));
          scaleFactor = layoutBounds.width / (numCols * colWidth);
        break;
        case FIXED_HEIGHT:
          numRows = Math.floor(layoutBounds.height / rowHeight);
          numCols = Math.ceil(numItems / numRows);
        break;
        case SCALE_TO_FIXED_HEIGHT:
          // TODO
          numRows = Math.max(1, Math.round(layoutBounds.height / rowHeight));
          scaleFactor = layoutBounds.height / rowHeight;
        break;

        case SCALE_TO_FIXED_SIZE:

        var tempHeight:Number = layoutBounds.height;
        var tempWidth:Number = layoutBounds.width;
        numCols = 1;

        while(numCols <= numItems)
        {
          scaleFactor = layoutBounds.width / (numCols * colWidth);
          var height:Number = Math.ceil(numItems / numCols) * rowHeight * scaleFactor;

          if(height <= tempHeight)
          {
            // we have a winner.
            break;
          }
          numCols++;
        }

        break;
      }

      colWidth = w * scaleFactor + margin;
      rowHeight = h * scaleFactor + margin;

      var i:int = 0;
      visualization.data.nodes.visit(function(d:NodeSprite):void
      {
        t.$(d).u = t.$(d).x = (i % numCols) * colWidth;
        t.$(d).v = t.$(d).y = Math.floor(i / numCols) * rowHeight;

        // overrides default/optimal size settings
        t.$(d).width = colWidth - margin;
        t.$(d).height = rowHeight - margin;

        i++;
      });

      layoutBounds.height = Math.floor(i / numCols) * rowHeight + rowHeight;

      if((i % numCols) == 0)
      {
        // special case: last line was fully filled
        layoutBounds.height -= rowHeight;
      }
    }
  }
}