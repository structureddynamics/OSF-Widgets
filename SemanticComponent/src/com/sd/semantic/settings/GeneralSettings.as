package com.sd.semantic.settings
{
  /**
   * General settings used by all semantic component of the library.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class GeneralSettings extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array();
    
    /** Specifies if an error occured when parsing the setting file*/
    public var error:Boolean = false;

    /** list of attributes used as prefLabel if prefLabel is not available for a given record */
    public var prefLabelAttributes:Array = new Array();

    /** Location of the theme asset to load at runtime. This theme has to be a CSS file compiled in SWF */
    public var theme:String = "";

    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function GeneralSettings(xml:XML)
    {
      super(xml);
    }
  }
}