package org.etc
{
  import flash.display.GradientType;
  import flash.events.MouseEvent;
  import flash.filters.BevelFilter;
  import flash.geom.Matrix;
  
  import mx.core.UIComponent;
  import mx.core.UITextField;
  import mx.utils.ColorUtil;
  
  /**
   * Breadcrumb
   * 
   * This class is used by the BreadcrumbNavigator and acts similar to a Button or Tab in other
   * navigation components.
   * 
   * Other things you can do: Add the ability to have an icon to the control. Other Flex controls
   * use an icon property to pass in the class to use for the image.
   */
  
  public class Breadcrumb extends UIComponent
  {
    public function Breadcrumb()
    {
      super();
    }
    
    /**
     * The amount of overlap and the length of the point on a breadcrumb
     */
    public static const ARROW_MARGIN:int = 16;
    
    /**
     * The label for the Breadcrumb. UITextField is lighter than a Flex component such
     * as Label or Text. You have to use it in a more manual way (eg, use a TextFormat
     * to modify its appearance), but it can save memory and increase performance over
     * a Flex component.
     */
    protected var textField:UITextField;
    
    /**
     * These boolean help determine the appearance of the control as the mouse interacts
     * with it. You would normally switch skins to do this, but if you are drawing the
     * control within the control, this is one way to keep track of what is going on
     * with the state of the mouse.
     */
    private var isMouseOver:Boolean = false;
    private var isMouseDown:Boolean = false;
    
    /**
     * The title of the Breadcrumb.
     */
    private var _label:String;
    public function set label( value:String ) : void
    {
      _label = value;
      invalidateProperties();
    }
    public function get label() : String
    {
      return _label;
    }
    
    /**
     * Indicates if this instance of a Breadcrumb is the left-most in the
     * crumb list. It will receive a smaller left margin because it is not
     * being overlapped.
     */
    private var _firstCrumb:Boolean = true;
    public function get firstCrumb() : Boolean
    {
      return _firstCrumb;
    }
    public function set firstCrumb( value:Boolean ) : void
    {
      _firstCrumb = value;
      invalidateDisplayList();
    }
    
    /**
     * createChildren - Flex Framework Override
     * Creates the parts of this control.
     */ 
    override protected function createChildren():void
    {
      super.createChildren();
      
      textField = new UITextField();
      textField.styleName = this;
      addChild(textField);
      
      // Listen for mouse events to alter the appearance.
      addEventListener( MouseEvent.MOUSE_OVER, handleMouseEvent );
      addEventListener( MouseEvent.MOUSE_OUT, handleMouseEvent );
      addEventListener( MouseEvent.MOUSE_DOWN, handleMouseEvent );
      addEventListener( MouseEvent.MOUSE_UP, handleMouseEvent );
      
      filters = [ new BevelFilter(1) ];
    }
    
    /**
     * commitProperties - Flex Framework Override
     * This function is called when all of the children have been created and
     * all of the properties have been set. For this control, the textField has
     * been creates and the label property set so it is appropriate to set the
     * textField's text property from the label.
     */
    override protected function commitProperties():void
    {
      super.commitProperties();
      
      textField.text = label;
      
      // changing the label also affects the size of the component and it will need to 
      // be remeasured.
      invalidateSize();
    }
    
    /**
     * measure - Flex Framework Override
     * Determines the values of measuredWidth and measuredHeight.
     */
    override protected function measure() : void
    {
      // determine any padding placed on the component
      var padLeft:int = getStyle("paddingLeft");
      if( isNaN(padLeft) ) padLeft = 4;
      var padTop:int = getStyle("paddingTop");
      if( isNaN(padTop) ) padTop = 4;
      var padBottom:int = getStyle("paddingBottom");
      if( isNaN(padBottom) ) padBottom = 4;
      padBottom = Math.max(padBottom,4);
      
      // Determine these value by summing the parts
      measuredWidth = textField.getExplicitOrMeasuredWidth() + (firstCrumb ?0:ARROW_MARGIN) + padLeft + ARROW_MARGIN;
      measuredHeight= textField.getExplicitOrMeasuredHeight() + padTop + padBottom;
    }
    
    /**
     * updateDisplayList - Flex Framework Override
     * This function sizes and positions the textField and draws the outline and fill of the
     * component. When you use skins, updateDisplayList can size and position the correct skin
     * based on the mouse flags. The skins inherit the styles of this control and they are
     * then responsible for drawing themselves in the correct manner.
     */
    override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
    {
      graphics.clear();
      
      // Determine colors from style settings or set default values if not specified.
      var borderColor:uint = getStyle("borderColor");
      if( isNaN(borderColor) ) borderColor = 0xCCCCCC;
      var backgroundFillColors:Array = getStyle("backgroundFillColors");
      if( backgroundFillColors == null ) backgroundFillColors = [ 0xFFFFFF, 0x9C9C9C ];
      
      // Modify those settings based on the position of the mouse.
      if( isMouseDown ) backgroundFillColors = [ColorUtil.adjustBrightness2( getStyle("themeColor"), 80 ), ColorUtil.adjustBrightness2( getStyle("themeColor"), 10 ) ];
      else if( isMouseOver ) {
        borderColor = getStyle("themeColor");
        backgroundFillColors = [ColorUtil.adjustBrightness2( getStyle("themeColor"), 80 ), ColorUtil.adjustBrightness2( getStyle("themeColor"), 70 )];
      }
      
      // set the style for the border
      graphics.lineStyle(0, borderColor);
      
      // use a gradient fill on the control which is similar to the standard Flex controls.
      var m:Matrix = new Matrix();
      m.createGradientBox(unscaledWidth,unscaledHeight,Math.PI/2);
      graphics.beginGradientFill( GradientType.LINEAR, backgroundFillColors, [1,1], [0,255], m );
      
      // draw and fill the outline
      graphics.moveTo(0,0);
      graphics.lineTo(unscaledWidth-ARROW_MARGIN,0);
      graphics.lineTo(unscaledWidth,unscaledHeight/2);
      graphics.lineTo(unscaledWidth-ARROW_MARGIN,unscaledHeight);
      graphics.lineTo(0,unscaledHeight);
      graphics.lineTo(0,0);
      graphics.endFill();
      
      // position and size the textField label
      textField.move((firstCrumb?4:ARROW_MARGIN),4);
      textField.setActualSize(textField.getExplicitOrMeasuredWidth(), textField.getExplicitOrMeasuredHeight());
    }
    
    /**
     * handleMouseEvent -
     * Determine the flag settings based on the type of event.
     */
    private function handleMouseEvent( event:MouseEvent ) : void
    {
      if( event.type == MouseEvent.MOUSE_OVER ) {
        isMouseOver = true;
      } else if( event.type == MouseEvent.MOUSE_OUT ) {
        isMouseOver = false;
        isMouseDown = false;
      } else if( event.type == MouseEvent.MOUSE_DOWN ) {
        isMouseDown = true;
      } else if( event.type == MouseEvent.MOUSE_UP ) {
        isMouseDown = false;
      }
      
      // Once the values are set the control has to be redrawn so invalidateDisplayList is called to tell
      // the Flex Framework to invoke updateDisplayList when it is time. NEVER call updateDisplayList on
      // your own.
      invalidateDisplayList();
    }
    
    
  }
}