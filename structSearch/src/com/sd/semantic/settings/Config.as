package com.sd.semantic.settings
{
  import com.sd.semantic.settings.Settings;
  /**
   * @author Frederick Giasson, Structured Dynamics LLC.
   */  
  public class Config extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array();
    
    /** Specifies if an error occured when parsing the setting file*/
    public var error:Boolean = false;    
    
    public var searchEndpointUrl:String = "";
    public var dataset:String = "";
    public var windowWidth:uint = 400;

    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function Config(xml:XML)
    {
      super(xml);
    }
  }
}