package eu.stefaner.flareextensions.UI
{

  /**
   *	Base class for ContentItemSprites, FacetBoxElements
   *	provides click handler, selection state etc.
   *
   *	@langversion ActionScript 3.0
   *	@playerversion Flash 9.0
   *
   *	@author mo
   *	@since  23.11.2007 
   */
  import flash.geom.Rectangle;
  import flash.display.DisplayObject;

  import flare.vis.data.NodeSprite;

  import flash.display.Sprite;
  import flash.events.MouseEvent;
  import flash.text.TextField;

  public class InteractiveNodeSprite extends NodeSprite
  {

    public var bg:Sprite;
    private var _label:String;
    private var _selected:Boolean = false;
    public var filteredOut:Boolean = false;
    public var selectionMarker:Sprite;
    public var rollOverMarker:Sprite;
    public var label_tf:TextField;

    public function InteractiveNodeSprite(o:Object = null)
    {
      super();

      data = o;

      buttonMode = true;
      mouseChildren = false;

      addEventListener(MouseEvent.CLICK, onClick);
      addEventListener(MouseEvent.ROLL_OVER, onRollOver);
      addEventListener(MouseEvent.ROLL_OUT, onRollOut);

      if(bg == null)
      {
        createBackground();
      }

      var oldHeight:Number = height;
      var oldWidth:Number = width;

      if(rollOverMarker == null)
      {
        createRollOverMarker();
      }

      if(selectionMarker == null)
      {
        createSelectionMarker();
      }

      if(label_tf == null)
      {
        createLabelField();
      }
      addChild(bg);
      addChild(rollOverMarker);
      addChild(selectionMarker);
      addChild(label_tf);

      rollOverMarker.visible = false;
      selectionMarker.visible = selected;

      height = oldHeight;
      width = oldWidth;
    }

    protected function createBackground():void
    {
      bg = new Sprite();
      bg.graphics.beginFill(0xEEEEEE);
      bg.graphics.drawRect(0, 0, 100, 20);
    }

    protected function createLabelField():void
    {
      label_tf = new TextField();
    }

    protected function createSelectionMarker():void
    {
      selectionMarker = new Sprite();
      selectionMarker.graphics.beginFill(0xAAEEAA);
      selectionMarker.graphics.drawRect(0, 0, width, height);
    }

    protected function createRollOverMarker():void
    {
      rollOverMarker = new Sprite();
      rollOverMarker.graphics.beginFill(0xCCEECC);
      rollOverMarker.graphics.drawRect(0, 0, width, height);
    }

    //--------------------------------------
    //  CLASS METHODS
    //--------------------------------------
    public static function getVisibility(n:InteractiveNodeSprite):Boolean
    {
      return !n.filteredOut;
    };

    //--------------------------------------
    //  GETTER/SETTERS
    //--------------------------------------

    // label
    public function set label(arg:String):void
    {
      _label = arg;
      label_tf.text = arg;
    }

    public function get label():String
    {
      return _label;
    }

    override public function set height(value:Number):void
    {
      rollOverMarker.height = selectionMarker.height = bg.height = value;
    }

    override public function get height():Number
    {
      return bg.height;
    }

    override public function set width(value:Number):void
    {
      rollOverMarker.width = selectionMarker.width = bg.width = value;
      label_tf.width = value - label_tf.x;
    }

    override public function get width():Number
    {
      return bg.width;
    }

    // selected
    public function set selected(arg:Boolean):void
    {
      _selected = selectionMarker.visible = arg;
    }

    public function get selected():Boolean
    {
      return _selected;
    }

    // MOUSE EVENTS
    protected function onRollOver(e:MouseEvent = null):void
    {
      rollOverMarker.visible = true;
    };

    protected function onRollOut(e:MouseEvent = null):void
    {
      rollOverMarker.visible = false;
    };

    protected function onClick(e:MouseEvent):void
    {
      // override in subclass
      selected = !selected;
    };

    override public function set w(v:Number):void
    {
      super.w = v;
      width = Math.abs(v);
    }

    override public function set h(v:Number):void
    {
      super.h = v;
      height = Math.abs(h);
    }

    override public function render():void
    {

      var l:Number;

      //super.render();
      //g.drawRect(d.u-d.x, d.v-d.y, d.w, d.h);
      if(w > 0)
      {
        l = u - x;
      //width = w;
      }

      else
      {
        l = u - x + w;
      //width = -w;
      }
      var t:Number;

      if(h > 0)
      {
        t = v - y;
      //height = h;
      }

      else
      {
        t = v - y + h;
      //height = -h;
      }

      bg.x = selectionMarker.x = rollOverMarker.x = label_tf.x = l;
      bg.y = selectionMarker.y = rollOverMarker.y = label_tf.y = t;
    }

    override public function getBounds(targetCoordinateSpace:DisplayObject):Rectangle
    {
      return bg.getBounds(targetCoordinateSpace);
    }
  //--------------------------------------
  //  PUBLIC METHODS
  //--------------------------------------

  //--------------------------------------
  //  EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //  PRIVATE & PROTECTED INSTANCE METHODS
  //--------------------------------------
  }
}