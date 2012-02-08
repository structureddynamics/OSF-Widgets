package com.sd.semantic.events
{
  import flash.events.Event;

  /**
   * Series of events that can happen when something happen to a semantic component
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class SemanticComponentItemEvent extends Event
  {
    public function SemanticComponentItemEvent(type:String, selectedObject:Object = null, bubbles:Boolean = false, cancelable:Boolean = false)
    {
      super(type, bubbles, cancelable);

      this.selectedObject = selectedObject;
    }

    /** Click event when an item is clicked */
    public static const ITEM_CLICK:String = "itemClick";
    
    /** Mouse over event when the mouse move over an item */
    public static const ITEM_OVER:String = "itemOver";
    
    /** Mouse out event when the mouse move away from an item */
    public static const ITEM_OUT:String = "itemOut";

    /** Object in the screen that is the subject of the event */
    public var selectedObject:Object;

    /** Override the inherited clone() method. */
    override public function clone():Event
    {
      return new SemanticComponentItemEvent(type, selectedObject);
    }
  }
}