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

package com.flextoolbox.controls
{
	import flash.events.MouseEvent;
	
	import mx.controls.List;
	import mx.controls.listClasses.IListItemRenderer;
	import mx.core.DragSource;
	import mx.events.DragEvent;
	import mx.managers.DragManager;

	/**
	 * An extension of the standard Flex <code>List</code> control. Like the
	 * <code>labelField</code> and <code>labelFunction</code> properties,
	 * similar properties for the <code>enabled</code> value of item renderers
	 * give developers more control over the list. Custom drag formats allow
	 * developers to limit drag-and-drop between lists and create more powerful
	 * interactions.
	 * 
	 * @author Josh Tynjala
	 */
	public class AdvancedList extends List
	{
		
	//----------------------------------
	//  Constants
	//----------------------------------
		
		private static const DEFAULT_LIST_DRAG_FORMAT:String = "items";
		
	//----------------------------------
	//  Constructor
	//----------------------------------
	
		/**
		 * Constructor.
		 */
		public function AdvancedList()
		{
			super();
		}
		
	//----------------------------------
	//  Properties
	//----------------------------------
		
		/**
		 * @private
		 * Storage for the dragFormat property.
		 */
		private var _dragFormat:String = DEFAULT_LIST_DRAG_FORMAT;
		
		[Bindable]
		/**
		 * Sets the string value used to restrict the locations where dragged
		 * items from this list may be dropped. The standard mx.controls.List
		 * class offers no functionality to let the developer manipulate this
		 * value.
		 * 
		 * @see mx.managers.DragManager
		 * @see mx.managers.dragClasses.DragSource
		 */
		public function get dragFormat():String
		{
			return this._dragFormat;
		}
		
		/**
		 * @private
		 */
		public function set dragFormat(field:String):void
		{
			this._dragFormat = field;
		}
		
		/**
		 * @private
		 * Storage for the enabledField property.
		 */
		private var _itemBackgroundColors:Array;
		
		[Bindable]
		/**
		 * The name of the field in the data provider items to determine if the item
		 * renderer should be enabled. By default the list looks for a property named
		 * <code>enabled</code> on each item. However, if the data objects do not contain
		 * an <code>enabled</code> property, you can set the <code>enabledField</code>
		 * property to use a different value in the data object. 
		 */
		public function get itemBackgroundColors():Array
		{
			return this._itemBackgroundColors;
		}
		
		/**
		 * @private
		 */
		public function set itemBackgroundColors(colors:Array):void
		{
			this._itemBackgroundColors = colors;
			
			this.setStyle("alternatingItemColors", this._itemBackgroundColors);			
		}
		
		/**
		 * @private
		 * Storage for the enabledField property.
		 */
		private var _enabledField:String = "enabled";
		
		[Bindable]
		/**
		 * The name of the field in the data provider items to determine if the item
		 * renderer should be enabled. By default the list looks for a property named
		 * <code>enabled</code> on each item. However, if the data objects do not contain
		 * an <code>enabled</code> property, you can set the <code>enabledField</code>
		 * property to use a different value in the data object. 
		 */
		public function get enabledField():String
		{
			return this._enabledField;
		}
		
		/**
		 * @private
		 */
		public function set enabledField(field:String):void
		{
			if(this._enabledField != field)
			{
				this._enabledField = field;
				this.invalidateProperties();
			}
		}		
		
		/**
		 * @private
		 * Storage for the enabledFunction property.
		 */
		private var _enabledFunction:Function;
		
		[Bindable]
		/**
		 * A user-supplied function to run on each item to determine if its renderer is
		 * enabled. By default, the list looks for a property named <code>enabled</code>
		 * on each data provider item and displays it. However, some data sets do not have
		 * an <code>enabled</code> property nor do they have another property that can be
		 * used.
		 * 
		 * <p>The enabled function takes a single argument which is the item in the data
		 * provider and returns a Boolean value.</p>
		 * 
		 * <blockquote><code>enabledFunction(item:Object):Boolean</code></blockquote>
		 * 
		 */
		public function get enabledFunction():Function
		{
			return this._enabledFunction;
		}
		
		/**
		 * @private
		 */
		public function set enabledFunction(value:Function):void
		{
			if(this._enabledFunction != value)
			{
				this._enabledFunction = value;
				this.invalidateProperties();
			}
		}
		
	//----------------------------------
	//  Public Methods
	//----------------------------------
	
		/**
		 * Determines if the item renderer for a data provider item is enabled
		 * and if the user may interact with it. This value is not related to
		 * selection. If the list is selectable, but an item is disabled, that
		 * item may not be selected.
		 * 
		 * @param item		The data provider item
		 * @return			<code>true</code> if the item is enabled, and false if it is not.
		 */
		public function isItemEnabled(item:Object):Boolean
		{
			var isEnabled:Boolean = true;
			if(this.enabledFunction != null)
			{
				isEnabled = this.enabledFunction(item);
			}
			else if(this.enabledField && item && item.hasOwnProperty(this.enabledField))
			{
				isEnabled = item[this.enabledField];
			}
			return isEnabled;
		}
		
	//----------------------------------
	//  Protected Methods
	//----------------------------------
		
		/**
		 * @private
		 */
		override protected function selectItem(item:IListItemRenderer,
									  shiftKey:Boolean, ctrlKey:Boolean,
									  transition:Boolean = true):Boolean
		{
			//don't select disabled items.
			if(!item.enabled) return false;
			return super.selectItem(item, shiftKey, ctrlKey, transition);
		}
		
		/**
		 * @private
		 */
		override protected function drawItem(renderer:IListItemRenderer,
								selected:Boolean = false,
								highlighted:Boolean = false,
								caret:Boolean = false,
								transition:Boolean = false):void
		{
			if(renderer) //sometimes renderer is null
			{
				super.drawItem(renderer, selected, highlighted && renderer.enabled, caret, transition);
				renderer.enabled = this.isItemEnabled(renderer.data);
			}
		}
		
		/**
		 * @private
		 */
		override protected function addDragData(dragSource:Object):void // actually a DragSource
		{
			dragSource.addHandler(copySelectedItems, this.dragFormat);
		}
		
		/**
		 * @private
		 * Ignore mouse down events for disabled items.
		 */
		override protected function mouseDownHandler(event:MouseEvent):void
		{
			var item:IListItemRenderer = this.mouseEventToItemRenderer(event);
			if(item && item.enabled)
			{
				super.mouseDownHandler(event);
			}
		}

		/**
		 * @private
		 * Converts the new drag format to the old "items" format so that the
		 * excellent code written by the Flex team isn't wasted.
		 */
		override protected function dragEnterHandler(event:DragEvent):void
		{
			if(event.isDefaultPrevented())
				return;
	
			if(event.dragSource.hasFormat(this.dragFormat))
			{
				var dragSource:DragSource = new DragSource();
				dragSource.addData(event.dragSource.dataForFormat(this.dragFormat), DEFAULT_LIST_DRAG_FORMAT);
				event.dragSource = dragSource;
				super.dragEnterHandler(event);
			}
			else
			{
				this.hideDropFeedback(event);
				DragManager.showFeedback(DragManager.NONE);
			}
		}
		
		/**
		 * @private
		 * Converts the new drag format to the old "items" format so that the
		 * excellent code written by the Flex team isn't wasted.
		 */
		override protected function dragOverHandler(event:DragEvent):void
		{
			if(event.isDefaultPrevented())
				return;
				
			if(event.dragSource.hasFormat(this.dragFormat))
			{
				var dragSource:DragSource = new DragSource();
				dragSource.addData(event.dragSource.dataForFormat(this.dragFormat), DEFAULT_LIST_DRAG_FORMAT);
				event.dragSource = dragSource;
				super.dragOverHandler(event);
			}
			else
			{
				this.hideDropFeedback(event);
				DragManager.showFeedback(DragManager.NONE);
			}
		}
		
		/**
		 * @private
		 * Converts the new drag format to the old "items" format so that the
		 * excellent code written by the Flex team isn't wasted.
		 */
		override protected function dragDropHandler(event:DragEvent):void
		{
			if(event.isDefaultPrevented())
				return;
	
			this.hideDropFeedback(event);
	
			if(event.dragSource.hasFormat(this.dragFormat))
			{
				var dragSource:DragSource = new DragSource();
				dragSource.addData(event.dragSource.dataForFormat(this.dragFormat), DEFAULT_LIST_DRAG_FORMAT);
				event.dragSource = dragSource;
				super.dragDropHandler(event);
			}
		}
		
		//TODO: The dragCompleteHandler in mx.controls.List does not check for
		//the "items" drag format. The behavior could change, and it may be
		//smart to assume it will.
	
	}
}