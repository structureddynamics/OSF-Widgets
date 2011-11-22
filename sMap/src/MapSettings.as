package
{
  import com.sd.semantic.settings.Settings;
  
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
    //public var recordBaseUrl:String = "";
    
    /** Base URI used to refer to the record on the web */
    //public var recordBaseUri:String = "";

    /** 
    * Name of the attribute used to link a record to its main GIS map layer. The record is supposed to be
    * part of this map.
    */
    public var gisMapAttribute:String = "sco_gisMap";
    
    /** Initial scale (zoom) of the map in the component */
    public var initialScale:Number = 1;

    /** 
    * Initial width of the container of the map component for which
    * the initialTop and initialLeft offsets have been determined.
    */
    public var initialWidth:Number = 0;
    
    /** 
     * Initial height of the container of the map component for which
     * the initialTop and initialLeft offsets have been determined.
     */
    public var initialHeight:Number = 0;
    
    /** Initial Top position of the map in the component */
    public var initialTop:Number = 0;
    
    /** Initial Left position of the map in the component */
    public var initialLeft:Number = 0;
    
    /** Display the map layers selector panel */
    public var displayMapLayersSelector:Boolean = false;
    
    /** Display the map layers selector panel using an external HTML interface */
    public var displayMapLayersSelectorHTML:Boolean = false;
    
    /** Set of layer colors to use for each layer of a map. */
    public var layerColors:Array = [0xFFD2B48C,0xFFBC8F8F,0xFFF4A460,0xFFDAA520,0xFFB8860B,
      0xFFCD853F,0xFFD2691E,0xFF8B4513,0xFFA0522D,0xFFA52A2A,0xFF800000,0xFFCD5C5C,0xFFF08080,0xFFFA8072,0xFFE9967A,
      0xFFFFA07A,0xFFDC143C,0xFFFF0000,0xFFB22222,0xFF8B0000,0xFFFFB6C1,0xFFFF69B4,0xFFFF1493,0xFFC71585,0xFFDB7093,
      0xFFFFA07A,0xFFFF7F50,0xFFFF6347,0xFFFF4500,0xFFFF8C00,0xFFFFD700,0xFFFFFF00,0xFFD8BFD8,0xFFDDA0DD,0xFFEE82EE,
      0xFFDA70D6,0xFFFF00FF,0xFFBA55D3,0xFF9370DB,0xFF9966CC,0xFF8A2BE2,0xFF800080,0xFF4B0082,0xFF6A5ACD,0xFF483D8B,
      0xFFADFF2F,0xFF7FFF00,0xFF00FF00,0xFF32CD32,0xFF98FB98,0xFF00FA9A,0xFF00FF7F,0xFF3CB371,0xFF2E8B57,0xFF228B22,
      0xFF006400,0xFF9ACD32,0xFF6B8E23,0xFF808000,0xFF556B2F,0xFF66CDAA,0xFF8FBC8F,0xFF20B2AA,0xFF008B8B,0xFF00FFFF,
      0xFFAFEEEE,0xFF7FFFD4,0xFF40E0D0,0xFF5F9EA0,0xFF4682B4,0xFFB0C4DE,0xFFB0E0E6,0xFF87CEFA,0xFF00BFFF,0xFF1E90FF,
      0xFF6495ED,0xFF7B68EE,0xFF4169E1,0xFF0000FF];
    
    /** URLs of the layers that this tool could display; this is an associative array with the layersName config. */
    public var layersUrl:Array = [];
    
    /** Names of the layers that this tool could display; this is an associative array with the layersUrl config. */
    public var layersName:Array = [];
    
    /** Datasets where records are described in the system; this is an associative array with the layersName config. */
    public var layersDataset:Array = [];
    
    /** Base URI used to refer to the record on the web; this is an associative array with the layersName config. */
    public var layersRecordBaseUri:Array = [];
    
    /** Base URL used to refer to the record defined on the layer; this is an associative array with the layersName config.  */
    public var layersRecordBaseUrl:Array = [];
    
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