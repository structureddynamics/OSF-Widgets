package
{
	import com.sd.semantic.settings.Settings;
	
  /**
   * sMap settings used by the sWebMap semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */  
  public class WebMapSettings extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array("googleMapAPIKey");
    
    /** Specifies if an error occured when parsing the setting file */
    public var error:Boolean = false;
    
    /** The google map API key to use */
    public var googleMapAPIKey:String = "";

    /** The google map API URL to use */
    public var googleMapAPIUrl:String = "";
    
    /** Default zoom level (between 0 and 21, where 0 is the global World map */
    public var defaultZoom:int = 10;
    
    /** Default latitude where to position the map when loaded */
    public var defaultLat:Number = 46.8893;
    
    /** Default latitude where to position the map when loaded */
    public var defaultLong:Number = -71.1935;
        
    /**
    * Type of the map to use for this map instance
    * One of:
    * 
    *   "NORMAL_MAP_TYPE": the default view
    *   "SATELLITE_MAP_TYPE": showing Google Earth satellite images
    *   "HYBRID_MAP_TYPE": showing a mixture of normal and satellite views
    *   "PHYSICAL_MAP_TYPE": showing a physical relief map of the surface of the Earth
    *   "DEFAULT_MAP_TYPES": an array of these four types, useful for iterative processing
    */ 
    public var mapType:String = "NORMAL_MAP_TYPE";
    
    /** A MapTypeControl provides a control for selecting and switching between supported map types via buttons. */
    public var enableMapTypeControl:Boolean = false;
    
    /** A PositionControl contains a set of panning buttons to pan the map.  */
    public var enablePositionControl:Boolean = false;
    
    /** A ZoomControl contains buttons for zooming the map in and out and a zoom slider.  */
    public var enableZoomControl:Boolean = false;
    
    /** 
    * A OverviewMapControl shows a small map in the corner of the containing map and displays a 
    * rectangle representing the containing map viewport.   
    */
    public var enableOverviewMapControl:Boolean = false;
    
    /** A ScaleControl provides a control that shows the scale of the map. */
    public var enableScaleControl:Boolean = false;
    
    /** 
    * The structWSF web service base endpoint URL. Has to end with a ending slash "/"
    */
    public var structWSFBaseURL:String = "";
    
    /**
    * Accessible datasets where to get information to display on this map.
    * A list of datasets can be specified by url-encoding all dataset URI
    * and by splitting them with a semi-column ";". Also, "all" can be
    * specified to query all accessible datasets for a given user.
    */
    public var datasets:String = "all";
    
    /** Display the "search" section in the parent HTML webpage via the JavaScript bridge. */
    public var displaySearchHTML:Boolean = true;    
    
    /** Display the "results" section in the parent HTML webpage via the JavaScript bridge. */
    public var displayResultsHTML:Boolean = true;  
    
    /** Display the "filters" section in the parent HTML webpage via the JavaScript bridge. */
    public var displayFiltersHTML:Boolean = true;    
    
    /** Display the "search" section within the sWebMap component */
    public var displaySearch:Boolean = false;    
    
    /** Display the "results" section within the sWebMap component */
    public var displayResults:Boolean = false;  
    
    /** Display the "filters" section within the sWebMap component */
    public var displayFilters:Boolean = false; 
    
    /** Number of items per page */
    public var resultsPerPage:int = 10;
    
    /** URL of the default map icon image to use as a marker on the map. */
    public var defaultMarkerUrl:String = "";
    
    public var displayAttributesWithoutResults:Boolean = false;
    
    
    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function WebMapSettings(xml:XML)
    {
      super(xml);
    }
  }
}