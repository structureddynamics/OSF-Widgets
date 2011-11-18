////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2007 Josh Tynjala
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
//  IN THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////

package com.flextoolbox.controls.listClasses
{
  import flash.display.DisplayObject;
  import mx.controls.listClasses.*;
  import mx.core.UIComponent;
  import mx.core.mx_internal;
  import com.flextoolbox.controls.CheckBoxList;

  use namespace mx_internal;

  /**
   * The default drag proxy used when dragging from a <code>CheckBoxList</code> control.
   * A drag proxy is a component that parents the objects or copies of the objects
   * being dragged.
   * 
   * @see com.flextoolbox.controls.CheckBoxList
   * @author Josh Tynjala
   */
  public class CheckBoxListItemDragProxy extends UIComponent
  {

    //----------------------------------
    //  Constructor
    //----------------------------------

    /**
     *  Constructor.
     */
    public function CheckBoxListItemDragProxy()
    {
      super();
    }

    //----------------------------------
    //  Protected Methods
    //----------------------------------

    /**
     *  @private
     */
    override protected function createChildren():void
    {
      super.createChildren();

      var top:Number = NaN;

      var checkBoxList:CheckBoxList = CheckBoxList(owner);
      var src:IListItemRenderer = checkBoxList.indexToItemRenderer(checkBoxList.indexToDrag);

      if(!src)return;

      var item:Object = src.data;

      top = src.y;

      var o:IListItemRenderer = ListBase(owner).itemRenderer.newInstance();

      o.styleName = ListBase(owner);

      if(o is IDropInListItemRenderer)
      {
        var listData:BaseListData = IDropInListItemRenderer(src).listData;

        IDropInListItemRenderer(o).listData = item ? listData : null;
      }

      o.data = item;

      this.addChild(DisplayObject(o));

      o.setActualSize(src.width, src.height);
      o.y = src.y;

      this.measuredHeight = o.y + o.height;
      this.measuredWidth = src.width;

      this.invalidateDisplayList();
    }
  }
}