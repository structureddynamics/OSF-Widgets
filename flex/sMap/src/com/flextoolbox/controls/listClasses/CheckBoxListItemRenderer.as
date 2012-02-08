package com.flextoolbox.controls.listClasses
{
  import flash.display.DisplayObject;
  import flash.events.Event;

  import mx.controls.CheckBox;
  import mx.controls.List;
  import mx.controls.listClasses.BaseListData;
  import mx.controls.listClasses.IDropInListItemRenderer;
  import mx.controls.listClasses.IListItemRenderer;
  import mx.controls.listClasses.ListData;
  import mx.core.IFlexDisplayObject;
  import mx.core.UIComponent;
  import mx.events.FlexEvent;

  //--------------------------------------
  //  Events
  //--------------------------------------

  /**
   *  Dispatched when the <code>data</code> property changes.
   *
   *  <p>When you use a component as an item renderer,
   *  the <code>data</code> property contains the data to display.
   *  You can listen for this event and update the component
   *  when the <code>data</code> property changes.</p>
   * 
   *  @eventType mx.events.FlexEvent.DATA_CHANGE
   */
  [Event(name = "dataChange", type = "mx.events.FlexEvent")]

  /**
   * The CheckBoxListItemRenderer class defines an item renderer
   * that displays selection through a CheckBox for a List control. 
   * By default, the item renderer draws the text associated
   * with each item in the list, and an optional icon.
   *
   * <p>You can override the default item renderer
   * by creating a custom item renderer.</p>
   *
   * @see mx.controls.List
   * @see mx.controls.listClasses.IDropInListItemRenderer
   */
  public class CheckBoxListItemRenderer extends UIComponent implements IListItemRenderer, IDropInListItemRenderer
  {

    //--------------------------------------
    //  Constructor
    //--------------------------------------

    /**
     * Constructor.
     */
    public function CheckBoxListItemRenderer()
    {
      super();
    }

    //--------------------------------------
    //  Properties
    //--------------------------------------

    protected var checkBox:CheckBox;

    /**
     *  The internal IFlexDisplayObject that displays the icon in this renderer.
     */
    protected var icon:IFlexDisplayObject;

    /**
     *  @private
     */
    private var listOwner:List;

    /**
     *  @private
     *  Storage for the data property.
     */
    private var _data:Object;

    [Bindable("dataChange")]
    /**
     *  The implementation of the <code>data</code> property
     *  as defined by the IDataRenderer interface.
     *  When set, it stores the value and invalidates the component 
     *  to trigger a relayout of the component.
     *
     *  @see mx.core.IDataRenderer
     */
    public function get data():Object
    {
      return _data;
    }

    /**
     *  @private
     */
    public function set data(value:Object):void
    {
      this._data = value;
      this.invalidateProperties();
      this.dispatchEvent(new FlexEvent(FlexEvent.DATA_CHANGE));
    }


    /**
     *  @private
     *  Storage for the listData property.
     */
    private var _listData:ListData;

    /**
     *  The implementation of the <code>listData</code> property
     *  as defined by the IDropInListItemRenderer interface.
     *
     *  @see mx.controls.listClasses.IDropInListItemRenderer
     */
    public function get listData():BaseListData
    {
      return _listData;
    }

    /**
     *  @private
     */
    public function set listData(value:BaseListData):void
    {
      this._listData = ListData(value);

      if(this.listOwner)
      {
        this.listOwner.removeEventListener(Event.CHANGE, listOwnerChangeHandler);
      }

      if(this._listData)
      {
        this.listOwner = List(this._listData.owner);
        this.listOwner.addEventListener(Event.CHANGE, listOwnerChangeHandler, false, 0, true);
      }
      this.invalidateProperties();
    }

    override public function set enabled(value:Boolean):void
    {
      super.enabled = value;
      this.invalidateProperties();
    }

    /**
       * @private
       */
    override public function get baselinePosition():Number
    {
      return this.checkBox.baselinePosition;
    }

    //--------------------------------------
    //  Protected Methods
    //--------------------------------------

    /**
     * @private
     */
    override protected function createChildren():void
    {
      super.createChildren();

      if(!this.checkBox)
      {
        this.checkBox = new CheckBox();
        this.checkBox.styleName = this;
        this.checkBox.mouseEnabled = false;
//        this.checkBox.setStyle("paddingLeft", "10");

        addChild(this.checkBox);
      }
    }

    /**
     * @private
     */
    override protected function commitProperties():void
    {
      super.commitProperties();

      if(this.icon)
      {
        this.removeChild(DisplayObject(this.icon));
        this.icon = null;
      }

      if(this._data != null)
      {
        if(this._listData.icon)
        {
          var iconClass:Class = this._listData.icon;
          this.icon = new iconClass();

          this.addChild(DisplayObject(this.icon));
        }

        this.checkBox.selected = this.listOwner.isItemSelected(this._listData);
        this.checkBox.label = this._listData.label ? this._listData.label : " ";
        this.checkBox.enabled = this.enabled;

        if(this.listOwner.showDataTips)
        {
          this.toolTip = this.checkBox.toolTip;
        }

        else
        {
          this.toolTip = null;
        }
      }

      else
      {
        this.checkBox.label = " ";
        this.toolTip = null;
      }
    }


    /**
     * @private
     */
    override protected function measure():void
    {
      super.measure();

      var w:Number = 0;

      if(this.icon)
      {
        w = this.icon.measuredWidth;
      }

      // Guarantee that label width isn't zero
      // because it messes up ability to measure.
      if(this.checkBox.width < 4 || this.checkBox.height < 4)
      {
        this.checkBox.width = 4;
        this.checkBox.height = 16;
      }

      if(isNaN(this.explicitWidth))
      {
        w += this.checkBox.getExplicitOrMeasuredWidth();
        this.measuredWidth = w;
        this.measuredHeight = this.checkBox.getExplicitOrMeasuredHeight();
      }

      else
      {
        this.measuredWidth = this.explicitWidth;
        this.checkBox.setActualSize(Math.max(this.explicitWidth - w, 4), this.checkBox.height);
        this.measuredHeight = this.checkBox.getExplicitOrMeasuredHeight();

        if(this.icon && this.icon.measuredHeight > this.measuredHeight)
        {
          this.measuredHeight = this.icon.measuredHeight;
        }
      }
    }

    /**
     * @private
     */
    override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
    {
      super.updateDisplayList(unscaledWidth, unscaledHeight);

      var xPosition:Number = 0;

      if(this.icon)
      {
        this.icon.x = xPosition;
        xPosition = this.icon.x + this.icon.measuredWidth;
        this.icon.setActualSize(this.icon.measuredWidth, this.icon.measuredHeight);
      }

      this.checkBox.x = xPosition;
      this.checkBox.setActualSize(unscaledWidth - xPosition, this.measuredHeight);

      var verticalAlign:String = this.getStyle("verticalAlign");

      if(verticalAlign == "top")
      {
        this.checkBox.y = 0;

        if(this.icon)
        {
          icon.y = 0;
        }
      }
      else if(verticalAlign == "bottom")
      {
        this.checkBox.y = unscaledHeight - this.checkBox.height + 2; // 2 for gutter

        if(this.icon)
        {
          this.icon.y = unscaledHeight - this.icon.height;
        }
      }

      else
      {
        this.checkBox.y = (unscaledHeight - this.checkBox.height) / 2;

        if(this.icon)
        {
          this.icon.y = (unscaledHeight - this.icon.height) / 2;
        }
      }
    }

    /**
     * @private
     */
    protected function listOwnerChangeHandler(event:Event):void
    {
      this.invalidateProperties();
      this.validateNow();
    }
  }
}