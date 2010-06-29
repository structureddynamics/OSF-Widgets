package com.sd.semantic.events
{
  import flash.events.Event;

  /**
   * Event notifying when a schema has been loaded in the system
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class SchemaLoadedEvent extends Event
  {
    public function SchemaLoadedEvent(type:String)
    {
      super(type);
    }

    /** Define static constant. */
    public static const SCHEMA_LOADED:String = "schemaLoaded";

    /** Override the inherited clone() method. */
    override public function clone():Event
    {
      return new SchemaLoadedEvent(type);
    }
  }
}