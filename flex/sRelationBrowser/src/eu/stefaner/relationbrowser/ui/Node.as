package eu.stefaner.relationbrowser.ui
{
  import eu.stefaner.relationbrowser.data.NodeData;
  
  import flare.animate.TransitionEvent;
  import flare.animate.Transitioner;
  import flare.util.Displays;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.NodeSprite;
  
  import flash.display.Sprite;
  import flash.events.Event;
  import flash.geom.ColorTransform;
  import flash.geom.Rectangle;
  import flash.text.TextField;
  import flash.text.TextFormat;
  
  import mx.controls.ToolTip;
  import mx.managers.ToolTipManager;
  
  /**
   *Class description.
   *
   *@langversion ActionScript 3.0
   *@playerversion Flash 9.0
   *
   *@author mo
   *@since  05.11.2007
   */
  public class Node extends NodeSprite
  {
    public var title_tf:TextField;
    public var fullLabel:String = "";
    public var backgroundImage:SpriteImage = null;
    public var t:Transitioner;
    private var runningRollOverTransition:Boolean;
    private var doRollOutAfterTransitionEnd:Boolean;
    private var tip:ToolTip = null;

    /**
     *@Constructor
     */
    public function Node(data:NodeData = null)
    {
      super();

      /** Skin the node using an image */
      if(data.skin.image != "")
      {
        renderer = null;
          
        backgroundImage = new SpriteImage(data.skin.image);
        
        this.addChild(backgroundImage);
      }
      
      /** Create the text to display on the node */
      title_tf = new TextField();

      addChild(title_tf);
     
      this.data = data;
       
      mouseChildren = false;
      
      Displays.addStageListener(this, Event.ADDED_TO_STAGE, onStageInit);  
    }
    
    /**
     * PUBLIC
     */
    public override function render():void
    {
      super.render();

      if(data && this.data.skin.displayNodeLabel)
      {
        if(data.skin.textMultilines)
        {
          var linesLength:int = (data.label.length / data.skin.textMaxNbLines);
          var words:Array = String(data.label).split(" ");
          var line:String = "";
          
          for each(var word:String in words)
          {
            line = line + word + " ";
            
            if(line.length > (linesLength * line.split("\n").length) && data.skin.textMaxNbLines >= line.split("\n").length)
            {
              line = line + "\n";
            }
          }
          
          title_tf.text = line;
        }
        else
        {
          title_tf.text = data.label;
        }
        
        fullLabel = data.label;
        
        title_tf.textColor = data.skin.textColor;       
        
        titleFormat = new TextFormat();
        titleFormat.font = data.skin.textFont;
        titleFormat.align = "center";
        titleFormat.size = data.skin.textSize;
        title_tf.setTextFormat(titleFormat);        
        
        adjustTitleFieldSize();
      }        
    }

    public function show(_t:Transitioner = null):void
    {
      _t = Transitioner.instance(_t);
      _t.$(this).alpha = 1;
      _t.$(this).visible = true;
      visible = true;
    }

    public function adjustTitleFieldSize(action:String=""):void
    {
      if(!this.data.skin.automaticCentering)
      {
        title_tf.width = Math.min(title_tf.textWidth + 10, this.data.skin.textMaxWidth);
        title_tf.height = Math.min(title_tf.textHeight + 5, this.data.skin.textMaxHeight);
        
        if(title_tf.textWidth > title_tf.width && (title_tf.textWidth + 10) > data.skin.textMaxWidth)
        {
          /** Truncate the text if it is too wide */
          var testTitle:TextField = new TextField();
          
          testTitle.text = title_tf.text + "...";
          
          while(testTitle.textWidth > data.skin.textMaxWidth)
          {
            testTitle.text = testTitle.text.substr(0, testTitle.length - 4) + "...";
          }
  
          title_tf.text = testTitle.text;
          title_tf.width = data.skin.textMaxWidth;
        }
        else if(title_tf.textWidth > title_tf.width && (title_tf.textWidth + 10) <= data.skin.textMaxWidth)
        {
          title_tf.width = title_tf.textWidth + 10;
        }        
        
        if(action == "rollOver")
        {
          title_tf.x = (- .5 * title_tf.width) + (data.skin.textOffsetX * data.skin.textScaleFactor);
          title_tf.y = (- .5 * title_tf.height) + (data.skin.textOffsetY * data.skin.textScaleFactor);
        }
        else
        {
          title_tf.x = (- .5 * title_tf.width) + data.skin.textOffsetX;
          title_tf.y = (- .5 * title_tf.height) + data.skin.textOffsetY;
        }        
      }
      else
      {
        title_tf.width = title_tf.textWidth + 15;
        title_tf.height = title_tf.textHeight + 15;
     
        /*
        if(title_tf.textWidth > data.skin.textMaxWidth)
        {
          var testTitle:TextField = new TextField();
          
          testTitle.text = title_tf.text + "...";
          
          while(testTitle.textWidth > data.skin.textMaxWidth)
          {
            testTitle.text = testTitle.text.substr(0, testTitle.length - 4) + "...";
          }
    
          title_tf.text = testTitle.text;
          title_tf.width = data.skin.textMaxWidth;
        }*/
       
        
        
  //      if(title_tf.textWidth > title_tf.width && (title_tf.textWidth + 10) > data.skin.textMaxWidth)
  //      {
  //        /** Truncate the text if it is too wide */
  //        var testTitle:TextField = new TextField();
  //        
  //        testTitle.text = title_tf.text + "...";
  //        
  //        while(testTitle.textWidth > data.skin.textMaxWidth)
  //        {
  //          testTitle.text = testTitle.text.substr(0, testTitle.length - 4) + "...";
  //        }
  //
  //        title_tf.text = testTitle.text;
  //        title_tf.width = data.skin.textMaxWidth;
  //      }
  //      else if(title_tf.textWidth > title_tf.width && (title_tf.textWidth + 10) <= data.skin.textMaxWidth)
  //      {
  //        title_tf.width = title_tf.textWidth + 10;
  //      }
        
        /** Automatically scale the text so that it fits the space of its node container */
   //     var localScale:Number = 1;
  //      var scaleSpaceWidth:int = this.width - 50;
  //      var scaleSpaceHeight:int = this.height - 50;
  //      
  //      if(scaleSpaceWidth <= 0)
  //      {
  //        scaleSpaceWidth = 1;
  //      }
  //      
  //      if(scaleSpaceHeight <= 0)
  //      {
  //        scaleSpaceHeight = 1;
  //      }
  //
  //      while(title_tf.width > scaleSpaceWidth || title_tf.height > scaleSpaceHeight)
        /*
        while(title_tf.width > this.width || title_tf.height > this.height)
        {
          localScale = localScale - 0.01;
          title_tf.scaleX = localScale;
          title_tf.scaleY = localScale;
        }   
        
        if(!runningRollOverTransition)
        {
          title_tf.scaleX = localScale;
          title_tf.scaleY = localScale;        
        }*/
        /*
        if(title_tf.width > data.skin.textMaxWidth)
        {
          var scaleRatio:Number = data.skin.textMaxWidth / title_tf.width;
          
          title_tf.scaleX = scaleRatio;
          title_tf.scaleY = scaleRatio;
        }
          
        if(title_tf.height > data.skin.textMaxHeight)
        {
          var scaleRatio:Number = data.skin.textMaxHeight / title_tf.height;
          
          title_tf.scaleX = scaleRatio;
          title_tf.scaleY = scaleRatio;
        }*/
        
        var textRadius:int =  Math.min(this.width, this.height);
        
        if(action == "rollOver")
        {        
   //       textRadius = (textRadius * data.skin.textScaleFactor);      
        }
        
        /** Center text */
        var offsetX:int = (textRadius - title_tf.width) / 2;
        var offsetY:int = (textRadius - title_tf.height) / 2;
        
        /** Adjust based on users' settings */
        if(action == "rollOver")
        {          
          offsetX = offsetX + (data.skin.textOffsetX * data.skin.textScaleFactor) ;
          offsetY = offsetY + (data.skin.textOffsetY * data.skin.textScaleFactor);
        }
        else
        {
          offsetX = offsetX + data.skin.textOffsetX;
          offsetY = offsetY + data.skin.textOffsetY;
        }
        
        /** Adjust the width of the text accordingly */
  //      if(offsetX < 0)
  //      {
  //        title_tf.width = textRadius;
  //      }
        
        /** Adjust the height of the text accordingly */
  //      if(offsetY < 0)
  //      {
  //        title_tf.height = textRadius;
  //      }
  
        /** Change the coordinate system to have the (0,0) at the top left of the parent sprite. */
        title_tf.x = (- this.width / 2);
        title_tf.y = (- this.height / 2);
        
        /** Change the offset */
        title_tf.x = title_tf.x + offsetX;
        title_tf.y = title_tf.y + offsetY;
        
        
        /*
        if(action == "rollOver")
        {
          title_tf.x = (- .5 * title_tf.width) + (data.skin.textOffsetX * data.skin.textScaleFactor);
          title_tf.y = (- .5 * title_tf.height) + (data.skin.textOffsetY * data.skin.textScaleFactor);
        }
        else
        {
          title_tf.x = (- .5 * title_tf.width) + data.skin.textOffsetX;
          title_tf.y = (- .5 * title_tf.height) + data.skin.textOffsetY;
        }*/
      }
    }
       
    public function onClick():void
    {
    }

    /**
     * EVENT HANDLERS
     */
    public function onRollOver(e:Event = null):void
    {
      doRollOutAfterTransitionEnd = false;

      if(runningRollOverTransition)
      {
        return;
      }
      
      if(scale >= 1)
      {
        refreshTransitioner();
        
        t.$(this).title_tf.scaleX = t.$(this).data.skin.textScaleFactor;
        t.$(this).title_tf.scaleY = t.$(this).data.skin.textScaleFactor;
        
        if(data.skin.image != "")
        {
          t.$(this).backgroundImage.scaleX = t.$(this).data.skin.backgroundScaleFactor;
          t.$(this).backgroundImage.scaleY = t.$(this).data.skin.backgroundScaleFactor;
        }
        else
        {
          title_tf.parent.scale = data.skin.backgroundScaleFactor;
        }
        
        t.play();
        runningRollOverTransition = true;
      }
      
      /** Handle tips */
      if(!tip && scale < 1 && data.skin.tooltips)
      {
        tip = ToolTipManager.createToolTip(data.label, this.stage.mouseX + 10, 
          this.stage.mouseY + 10) as ToolTip;
      }
      else if(fullLabel != title_tf.text && data.skin.tooltips)
      {
        tip = ToolTipManager.createToolTip(fullLabel, this.stage.mouseX + 10, 
          this.stage.mouseY + 10) as ToolTip;
      }
      
      adjustTitleFieldSize("rollOver");
      
      /** Add possible color overlay */
      this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, this.data.skin.overNodeColorOverlay[1],
                                                                     this.data.skin.overNodeColorOverlay[2],
                                                                     this.data.skin.overNodeColorOverlay[3],
                                                                     this.data.skin.overNodeColorOverlay[0]);
    }

    public function onRollOut(e:Event = null):void
    {
      if(runningRollOverTransition)
      {
        doRollOutAfterTransitionEnd = true;
        return;
      }
      
      if(scale > 1 || 
        title_tf.scaleX > 1 ||
        title_tf.scaleY > 1 ||
        (backgroundImage && (backgroundImage.scaleX > 1 || backgroundImage.scaleY > 1)))
      {      
        doRollOutAfterTransitionEnd = false;
        refreshTransitioner();
        
        title_tf.scaleX = 1;
        title_tf.scaleY = 1;
        
        if(backgroundImage)
        {
          if(backgroundImage.scaleX > 1 || backgroundImage.scaleY > 1)
          {
            backgroundImage.scaleX = 1;
            backgroundImage.scaleY = 1;
          }
        }
        else
        {
          title_tf.parent.scale = 1;
        }
        
        t.play();      
      }
      
      /** Handle tips */
      if(tip && data.skin.tooltips)
      {
        ToolTipManager.destroyToolTip(tip); 
        tip = null;
      }      
      
      adjustTitleFieldSize();
      
      /** Remove possible color overlay */
      if(!selected)
      {
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 1, 1, 1, 1);
      }      
    }

    private function refreshTransitioner():void
    {
      if(t != null)
      {
        t.reset();
        t.dispose();
      }
      t = new Transitioner(.33);

      t.addEventListener(TransitionEvent.STEP, onTransitionStep);
      t.addEventListener(TransitionEvent.END, onTransitionEnd);
      
      if(selected)
      {
        /** Apply possible selected node color overlay */
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, this.data.skin.selectedNodeColorOverlay[1],
          this.data.skin.selectedNodeColorOverlay[2],
          this.data.skin.selectedNodeColorOverlay[3],
          this.data.skin.selectedNodeColorOverlay[0]);          
      }      
    }

    private function onTransitionEnd(event:TransitionEvent):void
    {
      runningRollOverTransition = false;

      if(doRollOutAfterTransitionEnd)
      {
        doRollOutAfterTransitionEnd = false;
        onRollOut();
      }
      
      if(selected)
      {
        /** Apply possible selected node color overlay */
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, this.data.skin.selectedNodeColorOverlay[1],
                                                                       this.data.skin.selectedNodeColorOverlay[2],
                                                                       this.data.skin.selectedNodeColorOverlay[3],
                                                                       this.data.skin.selectedNodeColorOverlay[0]);          
      }
    }

    private function onTransitionStep(event:TransitionEvent):void
    {
      visitEdges(function(e:EdgeSprite):void
      {
        e.dirty();
        e.render();
      });
      
      if(selected)
      {
        /** Apply possible selected node color overlay */
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, this.data.skin.selectedNodeColorOverlay[1],
          this.data.skin.selectedNodeColorOverlay[2],
          this.data.skin.selectedNodeColorOverlay[3],
          this.data.skin.selectedNodeColorOverlay[0]);          
      }      
    }

    protected function onStageInit():void
    {
      render();
    }

    /* 
     *  GETTER/SETTER
     */
    override public function get data():Object
    {
      return super.data;
    }

    override public function set data(data:Object):void
    {
      if(!data is NodeData)
      {
        throw new Error("NodeData expected!");
      }
      super.data = data;
      render();
    }

    private var _selected:Boolean;

    public function get selected():Boolean
    {
      return _selected;
    }

    public function set selected(value:Boolean):void
    {
      if(value == true)
      {
        /** Apply possible selected node color overlay */
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, this.data.skin.selectedNodeColorOverlay[1],
                                                                       this.data.skin.selectedNodeColorOverlay[2],
                                                                       this.data.skin.selectedNodeColorOverlay[3],
                                                                       this.data.skin.selectedNodeColorOverlay[0]);      
      }      
      else
      {
        /** Remove possible selected node color overlay */
        this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 1, 1, 1, 1);      
      }
      
      if(value !== _selected)
      {
        _selected = value;
      }

      if(value)
      {
        visited = true;
      }
    }

    private var _scale:Number = 1;

    public function get scale():Number
    {
      return _scale || Math.max(scaleX, scaleY);
    }

    public function set scale(scale:Number):void
    {
      scaleX = scale;
      scaleY = scale;
      _scale = scale;
    //title_tf.visible = scale > .66;
    }

    private var _edgeRadius:Number = -1;
    private var initialEdgeRadius:Number = -1;

    public function get edgeRadius():Number
    {
      /*
      var newScale:Number = scale;
      
      if(data.skin.backgroundScaleFactor > scale)
      {
        newScale = data.skin.backgroundScaleFactor;
      }
      */
      if(initialEdgeRadius == -1)
      {
        initialEdgeRadius = _edgeRadius;
      }
      
      //return _edgeRadius != -1 ? _edgeRadius * newScale : Math.max(width, height) * .5 * 1.1;
      
      var displayRadius:Number;
      
      var modificator:Number = 1.05;
      
      if(scale > 1)
      {
        displayRadius = initialEdgeRadius * newScale;
      }

      if(scale <= 1 && scale >= 0.8)
      {
        /** If the scale is not small enough, we use the user's pre-defined edge radius */
        displayRadius = initialEdgeRadius;
      }
      
      if(scale < 0.8 && scale >= 0.5)
      {
        modificator = 1.15;
        
        displayRadius = initialEdgeRadius;
      }
      
      if(scale < 0.5 && scale >= 0.15)
      {
        modificator = 1.25;
        
        displayRadius = Math.max(width, height) * .5;
      }
      
      if(scale < 0.15)
      {
        modificator = 1.35;

        displayRadius = Math.max(width, height) * .5;
      }
      
      return displayRadius * modificator;
    }

    public function set edgeRadius(edgeRadius:Number):void
    {
      _edgeRadius = edgeRadius;
    } 

    private var _visited:Boolean = false;

    public function get visited():Boolean
    {
      return _visited;
    }

    public function set visited(visited:Boolean):void
    {
      _visited = visited;
    }
  }
}