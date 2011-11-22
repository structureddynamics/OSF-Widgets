package com.sd.semantic.events
{
  import flash.events.Event;
  
  /**
   * Series of events that can are trigged at load time of the semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class SemanticComponentLoadEvent extends Event
  {
    public function SemanticComponentLoadEvent(type:String, params:Object = null, bubbles:Boolean = false, cancelable:Boolean = false)
    {
      super(type, bubbles, cancelable);
      
      this.params = params;
    }
    
    public static const START:String = "start";
    
    public static const PROGRESS:String = "progress";
    
    /** Mouse out event when the mouse move away from an item */
    public static const COMPLETED:String = "completed";
    
    /** Object of kind {label: "", progress: 10} */
    public var params:Object;
    
    /** Override the inherited clone() method. */
    override public function clone():Event
    {
      return new SemanticComponentLoadEvent(type, params);
    }
  }
}