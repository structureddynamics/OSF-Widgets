package com.sd.semantic.settings
{
  /**
   * sMap settings used by the sMap semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */  
  public class MapSettings extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array();
    
    /** Specifies if an error occured when parsing the setting file */
    public var error:Boolean = false;
    
    /** Name of the map that can be displayed within the map tool */
    public var name:String = "";
    
    /** Specifies if the map features are selectable */
    public var selectable:Boolean = true;
    
    /** Specifies if you want the tooltips to be displayed within the map for each feature */
    public var tooltip:Boolean = true;
    
    /** Enable/show the zoom in/out control */
    public var enableZoom:Boolean = true;
    
    /** Enable the user to move the map with a mouse-click &amp; drag */
    public var enableMapMove:Boolean = true;
    
    /** Color of the lines that define the border of each feature */
    public var outlineColor:uint = 0x000000;
    
    /** Color of the fill of each feature */
    public var fillColor:uint = 0xFFFFFF;
    
    /** Color of the fill of a selected feature */
    public var fillSelectedColor:uint = 0XFFF000;
    
    /** Color of the fill of a moused over feature */
    public var fillHoverCorlor:uint = 0xcc0000;
    
    /** Base URL used to refer to the record on the web */
    public var recordBaseUrl:String = "";
    
    /** Base URI used to refer to the record on the web */
    public var recordBaseUri:String = "";

    /** 
    * Name of the attribute used to link a record to its main GIS map layer. The record is supposed to be
    * part of this map.
    */
    public var gisMapAttribute:String = "sco_gisMap";
    
    /** Initial scale (zoom) of the map in the component */
    public var initialScale:Number = 1;

    /** Initial Top position of the map in the component */
    public var initialTop:Number = 0;
    
    /** Initial Left position of the map in the component */
    public var initialLeft:Number = 0;
    
    /** Display the map layers selector panel */
    public var displayMapLayersSelector:Boolean = false;
    
    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function MapSettings(xml:XML)
    {
      super(xml);
    }
  }
}