/*
* Container which holds PodContentBase subclasses.
*/

package com.esria.samples.dashboard.view
{
import com.esria.samples.dashboard.events.PodStateChangeEvent;
import com.sd.semantic.components.sControl;

import flash.display.Graphics;
import flash.display.Sprite;
import flash.events.Event;
import flash.events.MouseEvent;

import mx.containers.HBox;
import mx.containers.Panel;
import mx.controls.Button;
import mx.events.DragEvent;
import mx.styles.*;

// Drag events.
[Event(name="dragStart", type="mx.events.DragEvent")]
[Event(name="dragComplete", type="mx.events.DragEvent")]
// Resize events.
[Event(name="minimize", type="com.esria.samples.dashboard.events.PodStateChangeEvent")]
[Event(name="maximize", type="com.esria.samples.dashboard.events.PodStateChangeEvent")]
[Event(name="restore", type="com.esria.samples.dashboard.events.PodStateChangeEvent")]

public class Pod extends Panel
{
	public static const MINIMIZED_HEIGHT:Number = 75;
	public static const WINDOW_STATE_DEFAULT:Number = -1;
	public static const WINDOW_STATE_MINIMIZED:Number = 0;
	public static const WINDOW_STATE_MAXIMIZED:Number = 1;
	
	public var windowState:Number; // Corresponds to one of the WINDOW_STATE variables.
	public var index:Number;	   // Index within the layout.
	
	private var controlsHolder:HBox;
	
	private var minimizeButton:Button;
	private var maximizeRestoreButton:Button;
	
	private var headerDivider:Sprite;
	
	// Variables used for dragging the pod.
	private var dragStartMouseX:Number;
	private var dragStartMouseY:Number;
	private var dragStartX:Number;
	private var dragStartY:Number;
	private var dragMaxX:Number;
	private var dragMaxY:Number;
	
	private var _showControls:Boolean;
	private var _showControlsChanged:Boolean;
	
	private var _maximize:Boolean;
	private var _maximizeChanged:Boolean;
	
	public function Pod()
	{
		super();
		doubleClickEnabled = true;
		setStyle("titleStyleName", "podTitle");
		
		windowState = WINDOW_STATE_DEFAULT;
		horizontalScrollPolicy = "off";
    
    /*
    import mx.styles.*;
    var style:CSSStyleDeclaration = StyleManager.getStyleDeclaration("Pod");
    StyleManager.setStyleDeclaration("Pod", style, true);
    */
    
    /*
    sDashboard = new CSSStyleDeclaration('sDashboard');
    StyleManager.setStyleDeclaration(".sDashboard", sDashboard, true);
    styleName = sDashboard;
    */
    
    styleName = "sDashboardPod";
	}
	
	override protected function createChildren():void
	{
		super.createChildren();
		
		if (!headerDivider)
		{
			headerDivider = new Sprite();
			titleBar.addChild(headerDivider);
		}
		
		if (!controlsHolder)
		{
			controlsHolder = new HBox();
			controlsHolder.setStyle("paddingRight", 11);
			controlsHolder.setStyle("horizontalAlign", "right");
			controlsHolder.setStyle("verticalAlign", "middle");
      controlsHolder.setStyle("horizontalGap", 3);
      controlsHolder.styleName = "podControlsHolder";
      
			rawChildren.addChild(controlsHolder);
		}
		
		if(!minimizeButton)
		{
			minimizeButton = new Button();
			minimizeButton.width = 14;
			minimizeButton.height = 14;
			minimizeButton.styleName = "minimizeButton";
			controlsHolder.addChild(minimizeButton);
		}
		
		if (!maximizeRestoreButton)
		{
			maximizeRestoreButton = new Button();
			maximizeRestoreButton.width = 14;
			maximizeRestoreButton.height = 14;
			maximizeRestoreButton.styleName = "maximizeRestoreButton";
			controlsHolder.addChild(maximizeRestoreButton);
		}
		
		addEventListeners();
	}
	
  private var fullTitle:String = "";
  
	override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
	{
    /** Save the full title string before doing any kind of update on it */
    if(fullTitle == "")
    {
      fullTitle = this.titleTextField.text;
    }
    else
    {
      this.titleTextField.text = fullTitle;
      this.titleBar.toolTip = "";
    }
    
		super.updateDisplayList(unscaledWidth, unscaledHeight);
		
		// Shift the divider one pixel up if minimized so there isn't a gap between the left and right borders.
		// The bottom border is removed if minimized.
		var deltaY:Number = windowState == WINDOW_STATE_MINIMIZED ? -1 : 0;

		controlsHolder.y = titleBar.y;
		controlsHolder.width = unscaledWidth;
		controlsHolder.height = titleBar.height;
    
    /** Fix the title's length according to the display space it has. */
    if(this.titleTextField.textWidth > this.titleBar.width)
    {
      this.titleTextField.text = this.titleTextField.text + "...";
      
      while((this.titleTextField.textWidth + 100) > this.titleBar.width)
      {
        this.titleTextField.text = this.titleTextField.text.substring(0, this.titleTextField.text.length - 4) + "...";
      }
      
      this.titleBar.toolTip = this.fullTitle;
    }
		
    /** "- 70" is used so that the title doesn't get under the minimize/maximize buttons */
		titleTextField.width = titleBar.width - getStyle("paddingLeft") - getStyle("paddingRight") - 70;
	}
  
  public function getTitleTextFieldWidth():int
  {
    return(titleTextField.textWidth);
  }
	
	private function addEventListeners():void
	{
		titleBar.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDownTitleBar);
		titleBar.addEventListener(MouseEvent.DOUBLE_CLICK, onClickMaximizeRestoreButton);
		titleBar.addEventListener(MouseEvent.CLICK, onClickTitleBar);
		
		minimizeButton.addEventListener(MouseEvent.CLICK, onClickMinimizeButton);
		maximizeRestoreButton.addEventListener(MouseEvent.CLICK, onClickMaximizeRestoreButton);
		
		addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
	}
	
	private function onMouseDown(event:Event):void
	{
		// Moves the pod to the top of the z-index.
		parent.setChildIndex(this, parent.numChildren - 1);
	}
	
	private function onClickMinimizeButton(event:MouseEvent):void
	{
		dispatchEvent(new PodStateChangeEvent(PodStateChangeEvent.MINIMIZE));
		// Set the state after the event is dispatched so the old state is still available.
		minimize();
	}
	
	public function minimize():void
	{
		// Hide the bottom border if minimized otherwise the headerDivider and bottom border will be staggered. 
		//setStyle("borderSides", "left top right");
    /*
    var style:CSSStyleDeclaration = StyleManager.getStyleDeclaration(".podMinimizedTitle");
    StyleManager.setStyleDeclaration("titleStyleName", style, true);    
    
    var testStyle:CSSStyleDeclaration = StyleManager.getStyleDeclaration("titleStyleName");
    var testStyle2:CSSStyleDeclaration = StyleManager.getStyleDeclaration(".titleStyleName");
    var testStyle3:CSSStyleDeclaration = StyleManager.getStyleDeclaration("podTitle");
    var testStyle4:CSSStyleDeclaration = StyleManager.getStyleDeclaration(".podTitle");
    
    mx.styles.StyleManager.getStyleDeclaration("titleStyleName").setStyle("paddingTop", 0);
*/
    setStyle("titleStyleName", "podMinimizedTitle");
    
		windowState = WINDOW_STATE_MINIMIZED;
    height = MINIMIZED_HEIGHT;
		showControls = false;
    
    
    
    /** Hide the content so that it is not shown in the minimized button */
    for each(var item:Object in this.getChildren())
    {
      if(item is sControl)
      {
        item.visible = false;
        item.alpha = 0;
        item.includeInLayout = false;
      }
    }    
	}
	
	private function onClickMaximizeRestoreButton(event:MouseEvent=null):void
	{
		showControls = true;
		if (windowState == WINDOW_STATE_DEFAULT)
		{
			dispatchEvent(new PodStateChangeEvent(PodStateChangeEvent.MAXIMIZE));
			// Call after the event is dispatched so the old state is still available.
			maximize();
		}
		else
		{
			dispatchEvent(new PodStateChangeEvent(PodStateChangeEvent.RESTORE));
			// Set the state after the event is dispatched so the old state is still available.
			windowState = WINDOW_STATE_DEFAULT;
			maximizeRestoreButton.selected = false;
		}
    
    /** Show the content that could have been hidden when minimized */
    for each(var item:Object in this.getChildren())
    {
      if(item is sControl)
      {
        item.visible = true;
        item.alpha = 1;
        item.includeInLayout = true;
      }
    }  
	}
	
	public function maximize():void
	{
		windowState = WINDOW_STATE_MAXIMIZED;
		
		_maximize = true;
		_maximizeChanged = true;
	}
	
	private function onClickTitleBar(event:MouseEvent):void
	{
		if (windowState == WINDOW_STATE_MINIMIZED)
		{
			// Add the bottom border back in case we were minimized.
//			setStyle("borderSides", "left top right bottom");
      
/*      
      var style:CSSStyleDeclaration = StyleManager.getStyleDeclaration("podTitle");
      StyleManager.setStyleDeclaration("titleStyleName", style, true);        
*/
      setStyle("titleStyleName", "podTitle");
      
			onClickMaximizeRestoreButton();
		}
	}

	private function onMouseDownTitleBar(event:MouseEvent):void
	{
		if (windowState == WINDOW_STATE_DEFAULT) // Only allow dragging if we are in the default state.
		{
			dispatchEvent(new DragEvent(DragEvent.DRAG_START));
			dragStartX = x;
			dragStartY = y;
			dragStartMouseX = parent.mouseX;
			dragStartMouseY = parent.mouseY;
			dragMaxX = parent.width - width;
			dragMaxY = parent.height - height;
			
			// Use the stage so we get mouse events outside of the browser window.
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
		}
	}
	
	private function onMouseMove(e:MouseEvent):void
	{
		// Make sure we don't go off the screen on the right.
		var targetX:Number = Math.min(dragMaxX, dragStartX + (parent.mouseX - dragStartMouseX));
		// Make sure we don't go off the screen on the left.
		x = Math.max(0, targetX);
		
		// Make sure we don't go off the screen on the bottom.
		var targetY:Number = Math.min(dragMaxY, dragStartY + (parent.mouseY - dragStartMouseY));
		// Make sure we don't go off the screen on the top.
		y = Math.max(0, targetY);
	}
	
	private function onMouseUp(event:MouseEvent):void
	{
		dispatchEvent(new DragEvent(DragEvent.DRAG_COMPLETE));
		
		stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
		stage.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp);
	}
		
	public function set showControls(value:Boolean):void
	{
		_showControls = value;
		_showControlsChanged = true;
		invalidateProperties();
	}
	
	override protected function commitProperties():void
	{
		super.commitProperties();
		
		if (_showControlsChanged)
		{
			controlsHolder.visible = _showControls;
			_showControlsChanged = false;
		}
		
		if (_maximizeChanged)
		{
			maximizeRestoreButton.selected = _maximize;
			_maximizeChanged = false;
		}
	}
}
}