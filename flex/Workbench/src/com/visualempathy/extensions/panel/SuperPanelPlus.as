/********************************************
 title   : SuperPanelPlus
 version : 1.0
 author  : Joel Hooks
 website : http://joelhooks.com
 date    : 2008-05-26
 * EXTENDS
 title   : SuperPanel
 version : 1.9
 author  : Wietse Veenstra
 website : http://www.wietseveenstra.nl
 date    : 2007-05-08
********************************************/
package com.visualempathy.extensions.panel {
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.geom.Point;
    import flash.geom.Rectangle;
    
    import mx.containers.Canvas;
    import mx.containers.Panel;
    import mx.controls.Button;
    import mx.controls.ColorPicker;
    import mx.controls.HRule;
    import mx.controls.HSlider;
    import mx.controls.Label;
    import mx.controls.TextInput;
    import mx.core.Application;
    import mx.core.UIComponent;
    import mx.events.DragEvent;
    import mx.events.EffectEvent;
    import mx.managers.CursorManager;
    
    [Event(name="closeClickEvent", type="flash.events.Event")]
    
    public class SuperPanelPlus extends Panel {
        [Bindable] public var showControls:Boolean     = false;
        [Bindable] public var resizeEnabled:Boolean = false;
        [Bindable] public var dragEnabled:Boolean    = false;
        
        [Embed(source="/images/resizeCursor.png")]
        private static var resizeCursor:Class;
        
        private var    pTitleBar:UIComponent;
        private var oW:Number;
        private var oH:Number;
        private var oX:Number; 
        private var oY:Number;
        private var oAlpha:Number            = 1;
        private var menuButton:Button        = new Button();
        private var normalMaxButton:Button    = new Button();
        private var closeButton:Button        = new Button();
        private var resizeHandler:Button    = new Button();
        private var saveButton:Button        = new Button();
        private var menuPanel:Panel            = new Panel();
        private var menuBarCanvas:Canvas    = new Canvas();
        private var colorPick:ColorPicker    = new ColorPicker();
        private var hRule01:HRule            = new HRule();
        private var alphaSlider:HSlider        = new HSlider();
        private var alphaLabel:Label        = new Label();
        private var colorLabel:Label        = new Label();
        private var menuLabel:Label            = new Label();
        private var titleLabel:Label        = new Label();
        private var oPoint:Point             = new Point();
        private var panelTitle:TextInput    = new TextInput();
        private var resizeCur:Number        = 0;
        
        [Inspectable(defaultValue=0.95)]
        [Bindable]
        private var _selectedBorderAlpha:Number = .95;
        public function get selectedBorderAlpha( ):Number { return _selectedBorderAlpha };
        public function set selectedBorderAlpha( value:Number ):void { _selectedBorderAlpha = value };
        
        [Inspectable(defaultValue=0.95)]
        [Bindable]
        private var _unselectedBorderAlpha:Number = .65;        
        public function get unselectedBorderAlpha( ):Number { return _unselectedBorderAlpha };
        public function set unselectedBorderAlpha( value:Number ):void { _unselectedBorderAlpha = value };
        
        [Inspectable(defaultValue=0.95)]
        [Bindable]
        private var _moveAlpha:Number = .65;
        public function get moveAlpha( ):Number { return _moveAlpha };
        public function set moveAlpha( value:Number ):void { _moveAlpha = value };
                
        [Inspectable(defaultValue=0.3)]
        [Bindable]
        private var _highlightAlpha1:Number = .3;
        public function get highlightAlpha1( ):Number { return _highlightAlpha1 };
        public function set highlightAlpha1( value:Number ):void { _highlightAlpha1 = value };
        
        [Inspectable(defaultValue=0.1)]
        [Bindable]
        private var _highlightAlpha2:Number = .1;
        public function get highlightAlpha2( ):Number { return _highlightAlpha2 };
        public function set highlightAlpha2( value:Number ):void { _highlightAlpha2 = value };
                        
        [Inspectable(defaultValue=0x333333)]
        [Bindable]
        private var _styleColor:uint = 0x333333;
        public function get styleColor( ):Number { return _styleColor };
        public function set styleColor( value:Number ):void { _styleColor = value };
                        
        public function SuperPanelPlus() {}

        override protected function createChildren():void {
            super.createChildren();
            this.pTitleBar = super.titleBar;
            this.setStyle("headerColors", [_styleColor, _styleColor]);
            this.setStyle("highlightAlphas", [_highlightAlpha1, _highlightAlpha2]);
            this.setStyle("borderColor", _styleColor);
            this.setStyle("borderAlpha", _selectedBorderAlpha);
            
            if (resizeEnabled) {
                this.resizeHandler.width     = 12;
                this.resizeHandler.height    = 12;
                this.resizeHandler.styleName = "resizeHandler";
                this.rawChildren.addChild(resizeHandler);
                this.initPos();
            }
            
            if (showControls) {
                this.normalMaxButton.width         = 10;
                this.normalMaxButton.height        = 10;
                this.normalMaxButton.styleName     = "increaseButton";
                this.normalMaxButton.toolTip    = "Increase panel size";
                this.closeButton.width             = 10;
                this.closeButton.height            = 10;
                this.closeButton.styleName         = "closeButton";
                this.closeButton.toolTip        = "Close panel";
                this.pTitleBar.addChild(this.normalMaxButton);
                this.pTitleBar.addChild(this.closeButton);
            }
            
            this.positionChildren();    
            this.addListeners();
        }
        
        public function initPos():void {
            this.oW = this.width;
            this.oH = this.height;
            this.oX = this.x;
            this.oY = this.y;
        }
        
        public function positionChildren():void {
            if (showControls) {
                this.normalMaxButton.buttonMode    = true;
                this.normalMaxButton.useHandCursor = true;
                this.normalMaxButton.x = this.unscaledWidth - this.normalMaxButton.width - 24;
                this.normalMaxButton.y = 8;
                this.closeButton.buttonMode       = true;
                this.closeButton.useHandCursor = true;
                this.closeButton.x = this.unscaledWidth - this.closeButton.width - 8;
                this.closeButton.y = 8;
            }
            
            if (resizeEnabled) {
                this.resizeHandler.y = this.unscaledHeight - resizeHandler.height - 1;
                this.resizeHandler.x = this.unscaledWidth - resizeHandler.width - 1;
            }
        }
                
        public function addListeners():void {
            this.addEventListener(MouseEvent.CLICK, panelClickHandler);
            
            if (dragEnabled) {
                this.pTitleBar.addEventListener(MouseEvent.MOUSE_DOWN, titleBarDownHandler);
            }
            
            if (showControls) {
                this.closeButton.addEventListener(MouseEvent.CLICK, closeClickHandler);
                this.normalMaxButton.addEventListener(MouseEvent.CLICK, normalMaxClickHandler);
            }
            
            if (resizeEnabled) {
                this.resizeHandler.addEventListener(MouseEvent.MOUSE_OVER, resizeOverHandler);
                this.resizeHandler.addEventListener(MouseEvent.MOUSE_OUT, resizeOutHandler);
                this.resizeHandler.addEventListener(MouseEvent.MOUSE_DOWN, resizeDownHandler);
            }
        }
        
        public function panelClickHandler(event:MouseEvent):void {
            this.pTitleBar.removeEventListener(MouseEvent.MOUSE_MOVE, titleBarMoveHandler);
            this.parent.setChildIndex(this, this.parent.numChildren - 1);
            this.panelFocusCheckHandler();
        }
        
        public function titleBarDownHandler(event:MouseEvent):void {
            this.pTitleBar.addEventListener(MouseEvent.MOUSE_MOVE, titleBarMoveHandler);
        }
        
        public function titleBarMoveHandler(event:MouseEvent):void {
            if (this.width < screen.width) {
                Application.application.parent.addEventListener(MouseEvent.MOUSE_UP, titleBarDragDropHandler);
                this.pTitleBar.addEventListener(DragEvent.DRAG_DROP,titleBarDragDropHandler);
                this.parent.setChildIndex(this, this.parent.numChildren - 1);
                this.panelFocusCheckHandler();
                this.alpha = _moveAlpha;
                this.startDrag(false, new Rectangle(0, 0, screen.width - this.width, screen.height - this.height));
            }
        }
        
        public function titleBarDragDropHandler(event:MouseEvent):void {
            this.pTitleBar.removeEventListener(MouseEvent.MOUSE_MOVE, titleBarMoveHandler);
            this.stopDrag();
            if (this.oAlpha < 1) {
                this.alpha = this.oAlpha;
            } else {
                this.alpha = 1;
            }
        }
        
        public function panelFocusCheckHandler():void {
            for (var i:int = 0; i < this.parent.numChildren; i++) {
                var child:UIComponent = UIComponent(this.parent.getChildAt(i));
                if (this.parent.getChildIndex(child) < this.parent.numChildren - 1) {
                    child.setStyle("borderAlpha", _unselectedBorderAlpha);
                } else if (this.parent.getChildIndex(child) == this.parent.numChildren - 1) {
                    child.setStyle("borderAlpha", _selectedBorderAlpha);
                }
            }
        }
        
        public function endEffectEventHandler(event:EffectEvent):void {
            this.resizeHandler.visible = true;
        }
        
        public function normalMaxClickHandler(event:MouseEvent):void {
            if (this.normalMaxButton.styleName == "increaseButton") {
                if (this.height > 28) {
                    this.initPos();
                    this.x = 0;
                    this.y = 0;
                    this.width = screen.width;
                    this.height = screen.height;
                    this.normalMaxButton.styleName = "decreaseButton";
                    this.normalMaxButton.toolTip = "Decrease panel size";
                    this.positionChildren();
                }
            } else {
                this.x = this.oX;
                this.y = this.oY;
                this.width = this.oW;
                this.height = this.oH;
                this.normalMaxButton.styleName = "increaseButton";
                this.normalMaxButton.toolTip = "Increase panel size";
                this.positionChildren();
            }
        }
        
        

        public function closeClickHandler(event:MouseEvent):void {
            this.removeEventListener(MouseEvent.CLICK, panelClickHandler);
            this.dispatchEvent( new Event( "closeClickEvent", true ) );
        }
        
        public function resizeOverHandler(event:MouseEvent):void {
            this.resizeCur = CursorManager.setCursor(resizeCursor);
        }
        
        public function resizeOutHandler(event:MouseEvent):void {
            CursorManager.removeCursor(CursorManager.currentCursorID);
        }
        
        public function resizeDownHandler(event:MouseEvent):void {
            Application.application.parent.addEventListener(MouseEvent.MOUSE_MOVE, resizeMoveHandler);
            Application.application.parent.addEventListener(MouseEvent.MOUSE_UP, resizeUpHandler);
            this.resizeHandler.addEventListener(MouseEvent.MOUSE_OVER, resizeOverHandler);
            this.panelClickHandler(event);
            this.resizeCur = CursorManager.setCursor(resizeCursor);
            this.oPoint.x = mouseX;
            this.oPoint.y = mouseY;
            this.oPoint = this.localToGlobal(oPoint);        
        }
        
        public function resizeMoveHandler(event:MouseEvent):void {
            this.stopDragging();
            
            var xPlus:Number = Application.application.parent.mouseX - this.oPoint.x;            
            var yPlus:Number = Application.application.parent.mouseY - this.oPoint.y;
            
            if (this.menuPanel.height == 150) {
                if (this.oW + xPlus > 215) {
                    this.width = this.oW + xPlus;
                }
                if (this.oH + yPlus > 200) {
                    this.height = this.oH + yPlus;
                }                
            } else {
                if (this.oW + xPlus > 140) {
                    this.width = this.oW + xPlus;
                }
                if (this.oH + yPlus > 80) {
                    this.height = this.oH + yPlus;
                }
            }
            this.positionChildren();
        }
        
        public function resizeUpHandler(event:MouseEvent):void {
            Application.application.parent.removeEventListener(MouseEvent.MOUSE_MOVE, resizeMoveHandler);
            Application.application.parent.removeEventListener(MouseEvent.MOUSE_UP, resizeUpHandler);
            CursorManager.removeCursor(CursorManager.currentCursorID);
            this.resizeHandler.addEventListener(MouseEvent.MOUSE_OVER, resizeOverHandler);
            this.initPos();
        }
    }
    
}