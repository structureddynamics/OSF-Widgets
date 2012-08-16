
$(document).ready(function() {
  
  /** Definin indexOf() on arrays for Internet Explorer */
  if(!Array.indexOf){                                                                            
    Array.prototype.indexOf = function(obj){
      for(var i=0; i<this.length; i++){
        if(this[i]==obj){
          return i;
        }
      }
      return -1;
    }
  }
});

function SWebMap()
{
  /** Self reference for total closure */
  var self = this; 

  /** HTML element where to create the sWebMap control */
  var canvas = arguments[0];
  
  /** Options of the sWebMap control */
  var options = arguments[1];
  
  // Initialize the control with all the options
  
  /**
  * Possible configuration options that can be defined before the sWebMap get created.
  */
  /** Default Latitude where to center the map control */
  this.defaultMapLat = (options.defaultMapLat != undefined ? options.defaultMapLat : "46.8415");
  
  /** Default Longitude where to center the map control */
  this.defaultMapLong = (options.defaultMapLong != undefined ? options.defaultMapLong : "-71.3198");
  
  /** Default Zoom where to start the map control */
  this.defaultMapZoom = (options.defaultMapZoom != undefined ? options.defaultMapZoom : 10);

  /** The URL where we can find the default marker icon if none are defined for a record */
  this.defaultMarkerUrl = (options.defaultMarkerUrl != undefined ? options.defaultMarkerUrl : "");

  /** 
  * This mode disable the default "browsing mode". The default behavior is that if you perform a search
  * without any keywords, then all mappable record get displayed on the map. Also, if no filters are
  * selected, then all mappable records get displayed. By disabling that mode, you force the user to
  * enter a search key string, or to select a filter in order to see any results.
  */
  this.disableBrowseMode = (options.disableBrowseMode != undefined ? options.disableBrowseMode : false);
  
  /** Displays the counts with the attribute/value filters */
  this.displayAttributeFiltersCounts = (options.displayAttributeFiltersCounts != undefined ? options.displayAttributeFiltersCounts : false);

  /** Displays the resultset section and the pagination */
  this.displayResultsHTML = (options.displayResultsHTML != undefined ? options.displayResultsHTML : true);

  /** Display the filters section */
  this.displayFilters = (options.displayFilters != undefined ? options.displayFilters : true);
  
  /** Display the filters to the user without performed a search query (so, without displaying the search results) */
  this.displayFiltersByDefault = (options.displayFiltersByDefault != undefined ? options.displayFiltersByDefault : false);
  
  /** Displays the counts with the type filters */
  this.displayTypeFiltersCounts = (options.displayTypeFiltersCounts != undefined ? options.displayTypeFiltersCounts : false);
  
  /** 
  * Specifies if you want to enable the focus windows for the sWebMap control. If these windows are enabled
  * the behavior of the component will change accordingly.
  */
  this.enableFocusWindows = (options.enableFocusWindows != undefined ? options.enableFocusWindows : false);
    
  /**
  * Enable the Record Display Overlay in the control. This option should only be enabled if a structView
  * is accessible on the same domain. If this option is not enabled, then a new page will be opened with
  * the record's URI as the URL of the webpage.
  */
  this.enableRecordDisplayOverlay = (options.enableRecordDisplayOverlay != undefined ? options.enableRecordDisplayOverlay : true);
    
  /** Let users persisting/tagging records on the map. */
  this.enableRecordSelection = (options.enableRecordSelection != undefined ? options.enableRecordSelection : true);
    
  /** Enable the map controls to save, load and share map sessions. */
  this.enableSessions = (options.enableSessions != undefined ? options.enableSessions : true);

  /** 
  * When a search action is performed in focus windows mode, we only query the focused window. If false,
  * all three focus windows will be queried, and data will be shown across all three windows.
  */
  this.queryFocusWindowOnly = (options.queryFocusWindowOnly != undefined ? options.queryFocusWindowOnly : true);
    
  /** 
  * The default lat/long positions, and the default zoom level, of each focus window. 
  * This option is only used if the focus windows mode is enabled.
  */
  this.focusMapsCenterPositions = (options.focusMapsCenterPositions != undefined ? options.focusMapsCenterPositions : {
    "focusMap1": {
      "lat": "46.7659",
      "lng": "-71.3198",
      "zoom": 12
    },
    "focusMap2": {
      "lat": "46.8056",
      "lng": "-71.3153",
      "zoom": 12
    },
    "focusMap3": {
      "lat": "46.8303",
      "lng": "-71.2216",
      "zoom": 12
    }
  });  
    
  /** Force to trigger a search after the map get loaded */
  this.forceSearch = (options.forceSearch != undefined ? options.forceSearch : false);

  /** API Key for the google URL shortener service. This is used to share map sessions */  
  this.googleUrlShortenerKey = (options.googleUrlShortenerKey != undefined ? options.googleUrlShortenerKey : "");
  
  /** Base URL where the images used by the sWebMap are available on the web */  
  this.imagesFolder = (options.imagesFolder != undefined ? options.imagesFolder : "");

  /** 
  * Specifies if we should only include the results that are included in the target inclusion records 
  * at load time.
  */
  this.includeResultsInTargetInclusionRecords = (options.includeResultsInTargetInclusionRecords != undefined ? options.includeResultsInTargetInclusionRecords : false);
  
  /**
  * Session to use to initialize the web map. The webmap will focus on the tagged records, will apply the default
  * filters, etc.
  */
  this.initializationSession = (options.initializationSession != undefined ? options.initializationSession : null);

  /**
  * Automatically tag a record if he is the only one returned for a particular search query.
  */
  this.automaticallyTagOneResult = (options.automaticallyTagOneResult != undefined ? options.automaticallyTagOneResult : false);
  
  /** 
  * Specify if the user that is using this tool can be considered an administrator. 
  * This enables new admin oriented features.
  */
  this.isAdmin = (options.isAdmin != undefined ? options.isAdmin : false);
  
  /** The main labels used in the sWebMap control */
  this.labels = {};
  
  if(options.labels == undefined)
  {
    options.labels = {};
  }
  
  this.directionsService = null;
  
  this.directionsDisplay = {
    "main": null,
    "focus1": null,
    "focus2": null,
    "focus3": null
  };
  
  /** Determine where to start getting directions from */
  this.directionsFromHere = null;
  
  /** Determine where to start getting directions to */
  this.directionsToHere = null;
  
  this.labels.searchButton = (typeof options.labels.searchButton != "undefined" ? options.labels.searchButton : "Search");
  this.labels.searchInput = (typeof options.labels.sesearchInputarchButton != "undefined" ? options.labels.searchInput : "Search Map");
  this.labels.saveSessionButton = (typeof options.labels.saveSessionButton != "undefined" ? options.labels.saveSessionButton : "Save");
  this.labels.deleteSessionButton = (typeof options.labels.deleteSessionButton != "undefined" ? options.labels.deleteSessionButton : "Delete");
  this.labels.shareSessionButton = (typeof options.labels.shareSessionButton != "undefined" ? options.labels.shareSessionButton : "Share");
  this.labels.loadSavedMapSessionInput = (typeof options.labels.loadSavedMapSessionInput != "undefined" ? options.labels.loadSavedMapSessionInput : "Load saved map...");
  this.labels.sourcesFilterSectionHeader = (typeof options.labels.sourcesFilterSectionHeader != "undefined" ? options.labels.sourcesFilterSectionHeader : "Sources");
  this.labels.typesFilterSectionHeader = (typeof options.labels.typesFilterSectionHeader != "undefined" ? options.labels.typesFilterSectionHeader : "Kinds");
  this.labels.attributesFilterSectionHeader = (typeof options.labels.attributesFilterSectionHeader != "undefined" ? options.labels.attributesFilterSectionHeader : "Attributes");
  this.labels.inclusionRecordsButtonOff = (typeof options.labels.inclusionRecordsButtonOff != "undefined" ? options.labels.inclusionRecordsButtonOff : "Show included records");
  this.labels.inclusionRecordsButtonOn = (typeof options.labels.inclusionRecordsButtonOn != "undefined" ? options.labels.inclusionRecordsButtonOn : "Show all records");
  
  /** URI of the datasets to make available to the map */
  this.mapDatasets = (options.mapDatasets != undefined ? options.mapDatasets : []);
  
  /** The irJSON schemas to be used by the sWebMap */
  this.schemas = (options.schemas != undefined ? options.schemas : []);  
  
  /** Default number of results per page (20, 50, 100 or 200) */
  this.mapResultsPerPage = (options.mapResultsPerPage != undefined ? options.mapResultsPerPage : 20);
  
  /** Specifies if you want to send a search each time the map is drag and dropped. */
  this.searchOnDrag = (options.searchOnDrag != undefined ? options.searchOnDrag : false);
    
  /** Specifies if you want to send a search each time the zoom of the map is changed. */
  this.searchOnZoomChanged = (options.searchOnZoomChanged != undefined ? options.searchOnZoomChanged : false);
  
  /**
  * This is the URL where the saved/shared map sessions will get resolved. This URL has to be
  * a URL where the sWebMap is accessible. This sWebMap should have access to the OSF instance
  * that host the records referenced by this map session. This URL is normally the current URL
  * but it can be different if you have a portal with multiple different sWebmap setups and where
  * all the saved map, accross all these applications, should be displayed.
  */
  this.sharedMapUrl = (options.sharedMapUrl != undefined ? options.sharedMapUrl : "");
  
  /**
  * Show the zoom control on the small focus windows
  */
  this.focusMapShowZoomControl = (options.focusMapShowZoomControl != undefined ? options.focusMapShowZoomControl : true);
  
  /**
  * Show the pan control on the small focus windows
  */
  this.focusMapShowPanControl = (options.focusMapShowPanControl != undefined ? options.focusMapShowPanControl : true);
  
  /**
  * Show the maptype selection control on the small focus window
  */
  this.focusMapShowMapTypeControl = (options.focusMapShowMapTypeControl != undefined ? options.focusMapShowMapTypeControl : true);
  
  /**
  * Show the street view control on the small focus window
  */
  this.focusMapShowStreetViewControl = (options.focusMapShowStreetViewControl != undefined ? options.focusMapShowStreetViewControl : true);
  
  /** Base URI of the structWSF endpoints. It as to end with a slash character. */
  this.structWSFAddress = (options.structWSFAddress != undefined ? options.structWSFAddress : "http://localhost/ws/search/");
   
  /** Additional CSS that have to be loaded when the content of a record is displayed in the popup window */
  this.recordDisplayCss = (options.recordDisplayCss != undefined ? options.recordDisplayCss : "");

  /** 
  * A list of records URI that can be used to toggle searches for records that are 
  * included in one of these records. The included records 
  * have to be related to one of these inclusion records using the geonames:locatedIn 
  * predicate. It is the way the sWebMap will knows if a record is 
  * geographically located within another record.
  * These inclusion records URI *have* to be defined in the "records" attribute of 
  * the "session" option."
  */
  this.inclusionRecords = (options.inclusionRecords != undefined ? options.inclusionRecords : []);
  
  /**
  * Specifies where the paginator control should be displayed in the sWebMap control. There
  * are two possible values:
  * 
  *   "top": shows the control above the list of results
  *   "bottom": shows the control below the list of results
  */
  this.paginatorLocation = (options.paginatorLocation != undefined ? options.paginatorLocation : "top");
  
  /**
  * Minimal radius distance between the center of a focus window and the sides of the rectangle
  * representing it on the main map. The distance is in meter. If this value is "0", then
  * the feature get disabled.
  */
  this.minimalFocusWindowRectangleRadius = (options.minimalFocusWindowRectangleRadius != undefined ? options.minimalFocusWindowRectangleRadius : 0);

  /** Specify if the user want to enable Google's directions service to get the path between two markers */
  this.enableDirectionsService = (options.enableDirectionsService != undefined ? options.enableDirectionsService : true);  
  
  /**
  * List all map type IDs to use for the sWebMap
  */
  this.mapTypeIds = (options.mapTypeIds != undefined ? options.mapTypeIds : null);

  /**
  * Show the traffic layer when the user is requestion directions between two markers.
  */
  this.directionsShowTrafficLayer = (options.directionsShowTrafficLayer != undefined ? options.directionsShowTrafficLayer : false);
  
  /**
  * List of all the custom map type functions that can be used for creating new map types.
  * Map types are based map tiles used as the base of the map.
  * 
  * This is an array of new map types. Two types are currently supported:
  * 
  * (1) custom
  * (2) wms
  * 
  * The custom type require a ID (a maptype ID) and a function. The function
  * is what is used to define the options of the map type.
  * 
  * The wms type require a name, which is used to specify the name of the
  * map type. It requires a baseUrl where the geo server is located and a
  * set of custom parameters needed by the WMS server.
  * 
  * This object looks like:
  * 
  *  [
  *    {
  *      "id": "NEWTYPE",
  *      "type": "custom",
  *      "func": {
  *        getTileUrl: function(coord, zoom) {
  *            return "http://mygeoserver.com/mapapi/getTile.aspx?x=" + coord.x + "&y=" + coord.y + "&zoom="+zoom;
  *        },
  *        tileSize: new google.maps.Size(256, 256),
  *        name: "MyGeoMapTiles",
  *        maxZoom: 18
  *      }
  *    },
  *    {
  *      "id": "NEW-WMS-TYPE",
  *      "name": "New WMS Type",
  *      "type": "wms",
  *      "baseUrl": "http://mywmsgeoserver.com/mapapi/parcel.ashx?",
  *      "wmsParams": [
  *        "WIDTH=256",
  *        "HEIGHT=256",
  *        "cache=0",
  *        "FIDs=12567"
  *      ]
  *    },
  *  ]
  */
  this.mapTypes = (options.mapTypes != undefined ? options.mapTypes : []);
  
  /**
  * List of all the custom map type functions that can be used for creating new layer.
  * Overlay layers are superposed above a map type, and have some transparency.
  * 
  * This is an array of new map types. Two types are currently supported:
  * 
  * (1) custom
  * (2) wms
  * 
  * The custom overlay layers require a ID (a maptype ID) and a function. 
  * The function is what is used to define the options of the map type.
  * 
  * The wms type require a name, which is used to specify the name of the
  * overlay layer. It requires a baseUrl where the geo server is located and a
  * set of custom parameters needed by the WMS server.
  * 
  * This object looks like:
  * 
  *  [
  *    {
  *      "id": "NEWTYPE",
  *      "type": "custom",
  *      "func": {
  *        getTileUrl: function(coord, zoom) {
  *            return "http://mygeoserver.com/mapapi/getTile.aspx?x=" + coord.x + "&y=" + coord.y + "&zoom="+zoom;
  *        },
  *        tileSize: new google.maps.Size(256, 256),
  *        name: "MyGeoMapTiles",
  *        maxZoom: 18
  *      }
  *    },
  *    {
  *      "id": "NEW-WMS-TYPE",
  *      "name": "New WMS Type",
  *      "type": "wms",
  *      "baseUrl": "http://mywmsgeoserver.com/mapapi/parcel.ashx?",
  *      "wmsParams": [
  *        "WIDTH=256",
  *        "HEIGHT=256",
  *        "cache=0",
  *        "FIDs=12567"
  *      ]
  *    },
  *  ]
  */  
  this.mapLayers =  (options.mapLayers != undefined ? options.mapLayers : []);
  
  /**
  * Search plugins are used to let the user contrains their searches on pre-defined
  * and specific information spaces.
  * 
  * If there is more than one search plugin defined, then a combo box will appear
  * next to the Search button to let the user selecting one of these search plugin.
  * 
  * This option is an array of objects which are defined with three variables:
  * 
  * (1) "name": the name of the search plugin; this is what appear in the combo box
  * 
  * (2) "target": the google map where the search is performed. This value can be: 
  *               (a) all, (b) focus, (c) main
  * 
  * (3) "datasets": the list of datasets where the search is performed
  * 
  * (4) "reach": This value can be:
  *                (a) "local":  the search is constrained to the current view port of the map.
  *                (b) "global": the search is performed for the records beyond the current
  *                              viewport of the map. If a result is found, the map
  *                              is refocused.
  * (5) "autoswitch": this parameter is used to tell the system if you want to select another
  *                   search plugin once the search is performed with this one. If the value
  *                   is empty, it means that it will remain the same. If the value is the 
  *                   name of another one, the user interface will automatically switch to it.
  */
  this.searchPlugins =  (options.searchPlugins != undefined ? options.searchPlugins : [{
    "name": "All",
    "datasets": ["all"],
    "target": "focus",
    "reach": "local",
    "autoswitch": ""
  }]);
  
  /**
  * Internal variables of all kind.
  */
  
  /** 
  * The session object used across the entire control.
  */
  this.session = {
    name: "",   // The name of the session
    notes: "",  // Some notes to display to the user about the session
    q: "",      // The search query
    fd: [],     // The dataset filters (dataset URIs to include in the resultset)
    fa: [],     // The attribute filters (attribute URIs to include in the resultset)
    ft: [],     // The type filters (type URIS to include in the resultset)
    av: {},     // The attribute/value filters (URI + value to include in the resultset)
    attributes_boolean_operator: "and", // The boolean operator to use when multiple attribute/value filters are defined.
    records: [] // The pre-selected (tagged) records to persist on the map
  };  
  
  /* List of tagger records URI */
  this.taggedRecords = [];    
  
  /** The number of results in the current resultset. */
  this.nbResults = 0;
    
  /** The page of the current resultset being displayed in the user interface */
  this.currentResultsetPage = 0;

  /** All the titles of the datasets being manipulated by the user */
  this.datasetsTitles = [];
  
  /** All the markers displayed on the map */  
  this.markers = [];
  
  /** All the polygons displayed on the map */
  this.polygons = [];

  /** All the polylines displayed on the map */
  this.polylines = [];
    
  /** The Google Map object */
  this.map;
  
  /** The ID of the saved map being viewed by the user. When the user select a new map to load, this ID changes. */
  this.selectedMapId = -1;
  
  /** Specifies of the map if being loaded */
  this.mapLoading = false;

  /** The templated resultsets (what is being displayed to the user) */
  this.templatesData = [];

  /** The set of dataset filters */
  this.filtersDatasets = [];

  /** The set of type filters */
  this.filtersTypes = [];

  /** The set of attribute filters */
  this.filtersAttributes = [];

  /** The list of dataset filters that have been checked (selected) by the user */
  this.checkedFiltersDatasets = [];

  /** The list of type filters that have been checked (selected) by the user */
  this.checkedFiltersTypes = [];

  /** The list of attribute filters that have been checked (selected) by the user */
  this.checkedFiltersAttributes = [];

  /** The set of attribute/value filters that have been defined by the user */
  this.attributeValueFilters = {};

  /** The set of results currently being used by the webmap */
  this.results = [];

  /* The resultset description of each tagged record */
  this.taggedResults = [];

  this.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]; 

  /** Focus maps currently used by the component */
  this.focusMaps = [];
  
  this.trafficLayer = null;
  
  /** 
  * Forces all focus windows to send a search query. For some actions, this behavior may be
  * needed, but for others not, so this is the variable that control that behavior to happen.
  */
  this.forceAllFocusWindowsSearch = false;
  
  /** The structXML resultset of the latest search query for the main map */
  this.mainMapResults;
  
  
  /** The structXML resultset of the latest search query for each of the focus map. */
  this.focusMapsResults = {
    "1": null,
    "2": null,
    "3": null
  };

  this.focusMapsTaggedRecords = {
    "1": [],
    "2": [],
    "3": []
  };
  
  this.howManyFocusMapsCreated = 0;
  
  /** ID of the focus map that is currently selected by the user */
  this.selectedFocusMapID = -1;
  
  /** 
  * This internal flag is used to know if the user requested any data from the map that got displayed
  * to him. If the user perform a search, or if the user select a filter, then this flag will be "true".
  * This is used to tame the behavior of searchOnZoomChanged and searchOnDrag. These won't be effective until
  * this flag is true.
  */
  this.dataRequestedByUser = (this.forceSearch ? true : false);
   
  /**
  * Creation of the sWebMap component. 
  * 
  * @param mapContainerElement the ID of the HTML element that will receive the sWebMap component.
  */
  this.createWebMap = function createWebMap(mapContainerElement) {
    
    var focusMapsHtml = '';
    
    var params = self.getUrlVars();
    
    // The first thing to check is if we are loading a map from the URL.
    // If we are, we have to make sure to enable the focus windows if needed.
    if(params.map != undefined && params.map != "" && typeof params.map != 'function')
    {
      var ses = JSON.parse(unescape(params.map));
      
      if(ses.fwe)
      {
        this.enableFocusWindows = true;
      }
    }    
   
    if(this.enableFocusWindows)
    {
      // Fix the label to display in the search box
      this.labels.searchInput = "Search Small Maps";
            
      focusMapsHtml = '<tr>\
                         <td colspan="2" style="width: 100%">\
                          <table id="webMapFocusWindows">\
                            <tr>\
                              <td style="padding: 0px; width: 33%;"><div id="mapFocus1" class="mapFocus1_unselected"></div></td>\
                              <td style="padding: 0px; width: 34%;"><div id="mapFocus2" class="mapFocus2_unselected"></div></td>\
                              <td style="padding: 0px; width: 33%;"><div id="mapFocus3" class="mapFocus3_unselected"></div></td>\
                            </tr>\
                          </table>\
                         </td>\
                       </tr>';
    }
    
    $('#' + mapContainerElement).append(' <div id="mapSessionsPanel" class="mapSessionsPanel" ></div>\
                                          <div id="mapSessionsMessagePanel" class="mapSessionsMessagePanel" ></div>\
                                          <div id="webMapSearch" class="webMapSearch" ></div>\
                                          <div id="webMapMain" class="webMapMain"></div>\
                                          <table id="webMap" class="webMap">\
                                            <tbody style="border: none;">\
                                              '+focusMapsHtml+'\
                                              <tr id="resultsCanvas">\
                                                <td valign="top" class="webMapResultsTd">\
                                                  <div class="webMapResults" id="webMapResults">\
                                                    '+(this.paginatorLocation == "top" ? '<div id="resultsPaginator" class="resultsPaginator" style="display:block; padding-bottom: 40px;"></div>' : '')+'\
                                                    <div id="mapActionsButtons" class="mapActionsButtons"></div>\
                                                    <div id="taggedRecordsBox" class="taggedRecordsBox"></div>\
                                                    <div id="resultsBox" class="resultsBox"></div>\
                                                    '+(this.paginatorLocation == "bottom" ? '<div id="resultsPaginator" class="resultsPaginator"></div>' : '')+'\
                                                  </div>\
                                                </td>\
                                                <td class="webMapFiltersTd" valign="top">\
                                                  <div id="webMapFilters" class="webMapFilters">\
                                                  </div>\
                                                </td>\
                                              </tr>\
                                            </tbody>\
                                          </table>\
                                          <div id="recordDescriptionOverlay" />\
                                          <div id="directionsOverlay">\
                                           <div style="width: 100%; height: 100%">\
                                             <img id="directionsOverlayClose" title="Close popup" src="" style="position:relative; float: right; cursor: pointer; top: 3px; right: 3px;" />\
                                             <div id="directionsPanelControls" style="display: none">\
                                               <table style="width: 100%; background: none repeat scroll 0 0 #EEEEEE; border: 1px solid silver; color: #000000;">\
                                                 <tbody style="border: none;">\
                                                  <tr>\
                                                    <td>\
                                                      <select id="directionsMode">\
                                                        <option value="bicycling">Bicycling</option>\
                                                        <option value="driving">Driving</option>\
                                                        <option value="walking">Walking</option>\
                                                      </select>\
                                                      '+(this.directionsShowTrafficLayer ? '<input type="checkbox" id="traffic" checked />Traffic' : '')+'\
                                                    </td>\
                                                  </tr>\
                                               </tbody>\
                                              </table>\
                                             </div>\
                                             <div id="directionsPanel"></div>\
                                           </div>\
                                          </div>');

    $('#webMap').width($('#webMap').parent().width());
    
    /** Set the size such that it doesn't change when filters get applied */
    $('.webMapFiltersTd').width($('#webMap').width() * 0.35);
    $('.webMapResultsTd').width($('#webMap').width() * 0.65);
    
    if(this.enableFocusWindows)
    {    
      $('#mapFocus1').width($('#mapFocus1').width());
      $('#mapFocus2').width($('#mapFocus2').width());
      $('#mapFocus3').width($('#mapFocus3').width());      
    }
    
    $('#recordDescriptionOverlay').hide();
    
    // Create the google this.map
    var latlong = new google.maps.LatLng(this.defaultMapLat, this.defaultMapLong);
    
    var mapOptions = {
      zoom: this.defaultMapZoom,
      center: latlong,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    // Add custom map tile layer(s)

    // Use the default type IDs if none have been specified by the user.    
    if(!this.mapTypeIds)
    {
      this.mapTypeIds = [];
      
      for(var type in google.maps.MapTypeId) 
      {
        this.mapTypeIds.push(google.maps.MapTypeId[type]);
      }
    }
    
    mapOptions.mapTypeControlOptions = {
      "mapTypeIds": this.mapTypeIds,
      "style": google.maps.MapTypeControlStyle.DROPDOWN_MENU
    };  
    
    this.map = new google.maps.Map(document.getElementById("webMapMain"), mapOptions);       
    
    if(this.enableDirectionsService)
    {
      $('#directionsMode').change(function(){
        self.calculateDirections();
      });
      
      if(this.directionsShowTrafficLayer)
      {
        $('#traffic').change(function(){
          if(document.getElementById('traffic').checked)
          {
            if(!self.trafficLayer)
            {
              self.trafficLayer = new google.maps.TrafficLayer();
            }
            
            self.trafficLayer.setMap(self.map);
          }
          else
          {
            self.trafficLayer.setMap(null);
          }
        });
      }
      
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay.main = new google.maps.DirectionsRenderer();
      
      this.directionsDisplay.main.setMap(this.map);
      this.directionsDisplay.main.setPanel(document.getElementById("directionsPanel"));
    }

    // Register all external image map types functions used to deliver the URL queries.    
    for(var it = 0; it < this.mapTypes.length; it++)
    {
      if(this.mapTypes[it].type == "wms")
      {
        this.map.mapTypes.set(this.mapTypes[it].id, getWMSMapType(this.map, this.mapTypes[it].baseUrl, this.mapTypes[it].wmsParams, this.mapTypes[it].name));  
      }
      else
      {
        this.map.mapTypes.set(this.mapTypes[it].id, new google.maps.ImageMapType(this.mapTypes[it].getTileUrl));  
      }
    }
    
    google.maps.event.addListenerOnce(this.map, 'idle', function(){

      google.maps.event.addListener(self.map, 'dragend', function(){
        
        if(self.dataRequestedByUser)
        {
          self.dataRequestedByUser = true;
        }
        else
        {
          self.dataRequestedByUser = false;
        }        
        
        if(!self.mapLoading && self.searchOnDrag && !self.enableFocusWindows)
        {
          self.forceAllFocusWindowsSearch = false;
          self.search();
        }
      });
      
      google.maps.event.addListener(self.map, 'zoom_changed', function(){
        
        if(self.dataRequestedByUser)
        {
          self.dataRequestedByUser = true;
        }
        else
        {
          self.dataRequestedByUser = false;
        }
        
        if(!self.mapLoading && self.searchOnZoomChanged && !self.enableFocusWindows)
        {          
          self.forceAllFocusWindowsSearch = false;
          self.search();
        }
      });  
      
      if(self.enableFocusWindows)
      {
        self.focusMaps.push(new SWebMapFocus());
        
        $('#mapFocus' + self.focusMaps.length).parent().css("height", "300px");

        self.focusMaps[self.focusMaps.length - 1].createFocusMap(self, "mapFocus" + self.focusMaps.length); 

        self.focusMaps[self.focusMaps.length - 1].focusPolygon = self.drawFocusPolygon(self.focusMaps[self.focusMaps.length - 1], $('#mapFocus' + self.focusMaps.length).css("border-top-color"));
        
        google.maps.event.addListenerOnce(self.focusMaps[self.focusMaps.length - 1].map, 'idle', function(){
          self.howManyFocusMapsCreated++;
        });
        
        self.focusMaps.push(new SWebMapFocus());
        
        $('#mapFocus' + self.focusMaps.length).parent().css("height", "300px");

        self.focusMaps[self.focusMaps.length - 1].createFocusMap(self, "mapFocus" + self.focusMaps.length); 

        self.focusMaps[self.focusMaps.length - 1].focusPolygon = self.drawFocusPolygon(self.focusMaps[self.focusMaps.length - 1], $('#mapFocus' + self.focusMaps.length).css("border-top-color"));

        google.maps.event.addListenerOnce(self.focusMaps[self.focusMaps.length - 1].map, 'idle', function(){
          self.howManyFocusMapsCreated++;
        });


        self.focusMaps.push(new SWebMapFocus());
        
        $('#mapFocus' + self.focusMaps.length).parent().css("height", "300px");

        self.focusMaps[self.focusMaps.length - 1].createFocusMap(self, "mapFocus" + self.focusMaps.length); 

        self.focusMaps[self.focusMaps.length - 1].focusPolygon = self.drawFocusPolygon(self.focusMaps[self.focusMaps.length - 1], $('#mapFocus' + self.focusMaps.length).css("border-top-color"));
        
        google.maps.event.addListenerOnce(self.focusMaps[self.focusMaps.length - 1].map, 'idle', function(){
          self.howManyFocusMapsCreated++;
        });        
      }
      
      /** Add the overlay layers selection tool if needed */      
      if(self.mapLayers.length > 0)
      {
        var selectMapLayersDiv = document.createElement('DIV');
        selectMapLayersDiv.id = "selectMapLayersDiv";
        var selectMapControl = new self.SelectMapLayersControl(selectMapLayersDiv, 'mapLayersList', self.map);
        
        selectMapLayersDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(selectMapLayersDiv);         
      }               
      
      if(self.enableSessions)
      {      
        var saveButtonDiv = document.createElement('DIV');
        var saveButtonControl = new self.SaveButtonControl(saveButtonDiv, self.map);

        saveButtonDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(saveButtonDiv);    


        var deleteButtonDiv = document.createElement('DIV');
        deleteButtonDiv.id = "deleteButtonDiv";
        var deleteButtonControl = new self.DeleteButtonControl(deleteButtonDiv, self.map);

        deleteButtonDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(deleteButtonDiv);    
        
        $(deleteButtonDiv).hide();

        var inclusionButtonDiv = document.createElement('DIV');
        inclusionButtonDiv.id = "inclusionButtonDiv";
        var inclusionButtonControl = new self.InclusionButtonControl(inclusionButtonDiv, self.map);

        inclusionButtonDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(inclusionButtonDiv);    
        
        $(inclusionButtonDiv).hide();


        /** We only show the share button if a key is defined in the options */
        if(self.googleUrlShortenerKey != "" && self.sharedMapUrl != "")
        {
          var linkButtonDiv = document.createElement('DIV');
          linkButtonDiv.id = "linkButtonDiv";
          var linkButtonControl = new self.LinkButtonControl(linkButtonDiv, self.map);

          linkButtonDiv.index = 1;
          self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(linkButtonDiv);    
          
          $(linkButtonDiv).hide();
        }


        var selectMapDiv = document.createElement('DIV');
        selectMapDiv.id = "selectMapDiv";
        var selectMapControl = new self.SelectMapControl(selectMapDiv, self.map);
        
        var sessions = self.getSessions();
      
        if(sessions.length <= 0)
        {
          $(selectMapDiv).hide();
        }

        selectMapDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(selectMapDiv); 
      }        

      /** Remove the default google background color generated by the map api */
      $("#webMapMain").css("background-color", ""); 
      
      /** Display search/browse/sessions controls */
      self.displaySearch();
      
      if($.cookie('webmap-resultsperpage') != null)
      {
        self.mapResultsPerPage = $.cookie('webmap-resultsperpage');
      }       
      
      if(params.map != undefined && params.map != "" && typeof params.map != 'function')
      {  
        self.startWaiting();
        self.mapLoading = true;
        
        var ses = JSON.parse(unescape(params.map));

        if(self.enableFocusWindows)
        {
          var check = function (ses) {
            
            if(self.howManyFocusMapsCreated == 3)
            {
              self.checkedFiltersDatasets = ses.fd;
              self.checkedFiltersTypes = ses.ft;
              self.checkedFiltersAttributes = ses.fa;
              
              self.attributeValueFilters = ses.av;      
              
              if(ses.notes != "")
              {
                $('#mapSessionsMessagePanel').empty();    
                
                $('#mapSessionsMessagePanel').append('<table style="margin: 20px;"><tbody style="border: none;"><tr><td><h2 style="margin: 0px;">Notes:</h2><br />'+ses.notes+'</td></tr></tbody></table>');
                
                $('#mapSessionsMessagePanel').fadeIn('slow', function() {});          
              } 
              
              // Tag all the previously tagged records.
            
              var isTaggedRecords = false;

              if(ses.fwe)
              {
                if(ses.f1.r.length > 0 || 
                   ses.f2.r.length > 0 ||
                   ses.f3.r.length > 0)
                {
                  isTaggedRecords = true;
                }
              }
              else
              {
                if(ses.records.length > 0)
                {
                  isTaggedRecords = true;
                }
              }
                    
              
              if(isTaggedRecords)
              {              
                self.loadMap(ses);
              }
            }
            else
            {
              setTimeout(check, 250, ses);
            }
          }
          
          setTimeout(check, 250, ses);
        }
        else
        {
          self.loadMap(ses);
        }
      }           
      else
      {        
        if(typeof self.initializationSession != "undefined" && self.initializationSession != null)
        {
          self.startWaiting();
          self.mapLoading = true;        
          
          self.initializeMap();
          
          sessionInitialized = true;
          
          self.stopWaiting();
          self.mapLoading = false;        
        }
        else
        {
          if(self.forceSearch)
          {
            self.dataRequestedByUser = true;
            self.forceAllFocusWindowsSearch = true;
            self.search();
          }
          else
          {
            if(self.displayFiltersByDefault)
            {
              self.forceAllFocusWindowsSearch = true;
              self.search();
            }
          }
        }
      }
    });    
  }
    
  /**
  * Perform a search query and display the returned result. 
  * The search will analyse the "session" object to set its parameters (filters, search query, etc). 
  */    
  this.search = function search() {
    
    if(!this.enableFocusWindows)
    {
      this.searchMap(this.map); 
    }
    else                         
    {
      var targetSearchPlugin = 0;
      
      if(this.searchPlugins.length > 1)
      {
        targetSearchPlugin = $('#searchPluginsSelect').val();
      }
      
      if(this.searchPlugins[targetSearchPlugin].target == "focus" || 
         this.searchPlugins[targetSearchPlugin].target == "all")
      {
        if(!this.queryFocusWindowOnly && this.forceAllFocusWindowsSearch)
        {
          this.hideUntaggedRecords();
          
          this.searchMap(this.focusMaps[0].map);
          this.searchMap(this.focusMaps[1].map);
          this.searchMap(this.focusMaps[2].map);
        }
        else
        {
          this.hideTargetFocusWindowRecords(this.selectedFocusMapID);
          
          this.searchMap(this.focusMaps[this.selectedFocusMapID - 1].map);
        }        
        
        if(this.searchPlugins[targetSearchPlugin].target == "all")
        {
          this.searchMap(this.map);
        }
      }
    }
  }
    
  /**
  * Perform a search query and display the returned result for the main map, or one of the focus maps. 
  * The search will analyse the "session" object to set its parameters (filters, search query, etc). 
  */
  this.searchMap = function searchMap(targetMap) {
    
    if((this.disableBrowseMode && ($("#searchInput").val() == "" || $("#searchInput").val() == this.labels.searchInput)) &&
        this.dataRequestedByUser &&
       (this.checkedFiltersAttributes.length == 0 &&
        this.checkedFiltersDatasets.length == 0 &&
        this.checkedFiltersTypes.length == 0))
    {
      $("#resultsPaginator").hide();
      this.dataRequestedByUser = false;
      this.prepareDisplayResults({resultset: {subject: []}}, targetMap);
      return;
    }
    
    if(this.session.q != "" && this.session.q != this.labels.searchInput)
    {
      this.session.q = $("#searchInput").val();
    }    
    
    var datasets = "";
    var types = "";
    var attributes = "";
    
    if(this.session.fd.length > 0)
    {
      for(var d = 0; d < this.session.fd.length; d++)
      {       
        datasets = datasets + this.session.fd[d] + ";";
      }
      
      datasets = datasets.substr(0, datasets.length - 1);
    }
    else
    {
      datasets = this.mapDatasets.join(";");
    }  
    
    // Replaces the datasets to query if the non-default search plugin is selected by the user.
    if(this.searchPlugins.length > 1 && this.searchPlugins[$('#searchPluginsSelect').val()].datasets[0] != "all")
    {
      datasets = this.searchPlugins[$('#searchPluginsSelect').val()].datasets;
    }
    
    if(this.session.ft.length > 0)
    {
      for(var t = 0; t < this.session.ft.length; t++)
      {
        types = types + this.session.ft[t] + ";";
      }
      
      types = types.substr(0, types.length - 1);
    }
    else
    {
      types = "all";
    }
    
    var count = 0;
    
    for(var av in this.session.av)
    {
      if(this.session.av.hasOwnProperty(av))
      {
        count++;
        break;
      }
    }
    
    if(count > 0)
    {
      for(var av in this.session.av)
      {
        if(this.session.av.hasOwnProperty(av))
        {
          attributes = attributes + this.urlencode(av) + "::" + this.urlencode(this.session.av[av]) + ";";  
        }
      }   
      
      attributes = attributes.substr(0, attributes.length - 1);
    }
    else
    {
      attributes = "all";
    }  
    
    /** Possibly contraining results to target neighbourhoods */
    if(this.includeResultsInTargetInclusionRecords)
    {
      if(attributes == "all")
      {
        attributes = "";
      }
      
      for(var tn = 0; tn < this.inclusionRecords.length; tn++)
      {
        attributes = attributes + ";" + this.urlencode("http://www.geonames.org/ontology#locatedIn") + "::" + this.urlencode(this.inclusionRecords[tn]) + ";";  
      }
      
      if(this.inclusionRecords.length > 1)
      {
        this.session.attributes_boolean_operator = "or";
      }
      else
      {
        this.session.attributes_boolean_operator = "and";
      }
    }
    
    /** Get the coordinates of the squares of the current view map */
    var bounds = targetMap.getBounds();
    var topRight = bounds.getNorthEast();
    var bottomLeft = bounds.getSouthWest();  
    
    this.startWaiting();
              
    $.ajax({
      type: "POST",
      url: this.structWSFAddress.replace(/\/+$/,"") + "/search/",
      data: "query=" + ($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val()) +
            "&datasets=" + datasets +
            "&types=" + types +
            "&attributes=" + attributes +
            "&items=" + (this.dataRequestedByUser ? this.mapResultsPerPage : "0") +
            "&page=" + (this.dataRequestedByUser ? (this.currentResultsetPage * this.mapResultsPerPage) : "0") +
            "&inference=" + (this.session.inference != undefined && this.session.inference == "on" ? "on" : "off") +
            "&attributes_boolean_operator=" + this.session.attributes_boolean_operator +
            "&include_aggregates=" + (this.displayFilters ? "true" : "false") +
            "&results_location_aggregator=" + targetMap.getCenter().lat() + ',' + targetMap.getCenter().lng() +
            "&range_filter=" + (this.searchPlugins.length > 1 && this.searchPlugins[$('#searchPluginsSelect').val()].reach.toLowerCase() == "global" ? "" : topRight.lat()+";"+topRight.lng()+";"+bottomLeft.lat()+";"+bottomLeft.lng()),
      dataType: "json",
      targetMap: targetMap,
      success: function(rset)
      {
        if(this.targetMap.b.id == "mapFocus1")
        {
          self.focusMapsResults["1"] = rset;
          
          if(!self.queryFocusWindowOnly)
          {
            self.selectedFocusMapID = 1;            
            self.focusMaps[0].toggleFocusWindowSelection();  
          }
        }
        
        if(this.targetMap.b.id == "mapFocus2")
        {
          self.focusMapsResults["2"] = rset;
          
          if(!self.queryFocusWindowOnly)
          {
            self.selectedFocusMapID = 2;
            self.focusMaps[1].toggleFocusWindowSelection();  
          }
        }
        
        if(this.targetMap.b.id == "mapFocus3")
        {
          self.focusMapsResults["3"] = rset;
          
          if(!self.queryFocusWindowOnly)
          {
            self.selectedFocusMapID = 3;
            self.focusMaps[2].toggleFocusWindowSelection();  
          }
        }
        
        if(this.targetMap.b.id == "webMapMain")
        {
          self.mainMapResults = rset;
        }
                
        self.prepareDisplayResults(rset, this.targetMap);
      },
      error: function(jqXHR, textStatus, error)
      {
        self.stopWaiting();
      }
    });            
  }

  /**
  * Prepare the sWebMap to display the resultset in the user interface.
  * 
  * @param rset The resultset to display in the resultset display part of the sWebMap component
  * @param targetMap The target map where markers, polygons and polylines have to be displayed.  
  */
  this.prepareDisplayResults = function prepareDisplayResults(rset, targetMap) {  
    var resultset = new Resultset(rset);
    
    /** Re-initialize the number of results */
    self.nbResults = 0;      
    
    /** Get the complete list of datasets for this resultset */
    var aggregates = resultset.getSubjectsByType("http://purl.org/ontology/aggregate#Aggregate");
    var datasetsAggregates = resultset.getSubjectsByPredicateObjectValue("http://purl.org/ontology/aggregate#property", "http://rdfs.org/ns/void#Dataset", aggregates);
    var datasets = [];     

    if($.cookie('webmap-datasetsTitles') != null)
    {
      self.datasetsTitles = JSON.parse(unescape($.cookie('webmap-datasetsTitles')));
    }
    
    // Re-initialize some of the properties of the filters datasets
    for(var fd = 0; fd < self.filtersDatasets.length; fd++)
    {
      self.filtersDatasets[fd].selected = false;
      self.filtersDatasets[fd].nbRecords = 0;
    }

    for(var da = 0; da < datasetsAggregates.length; da++)   
    {
      var datasetAggregate = datasetsAggregates[da];
      
      var datasetURI = datasetAggregate.predicate[1]["http://purl.org/ontology/aggregate#object"].uri;
      var nbRecords = datasetAggregate.predicate[2]["http://purl.org/ontology/aggregate#count"];

      
      if(!self.datasetsTitles[datasetURI])
      {
        /** 
         * If the dataset title is not existing, it means that the titles come from the local cache
         * and that a new dataset appeared on the structWSF instance.
         *   
         * This means that we have to re-fetch the dataset titles from the DatasetRead web service
         */
        
        self.getDatasetsTitles();
      }
      
      var checkboxSelected = false;
      
      if(self.checkedFiltersDatasets.indexOf(datasetURI) != -1)
      {
        checkboxSelected = true;
      }
      
      var found = false;
      
      for(var i = 0; i < self.filtersDatasets.length; i++)   
      {           
        if(self.filtersDatasets[i].uri == datasetURI)
        {
          self.filtersDatasets[i].selected = checkboxSelected;
          self.filtersDatasets[i].nbRecords = nbRecords;
          
          found = true;
        }
      }
      
      if(found == false)
      {
        self.filtersDatasets.push({
          prefLabel: self.datasetsTitles[datasetURI], 
          nbRecords: nbRecords, 
          uri:datasetURI, 
          selected:checkboxSelected
        });              
      } 
    } 
    
    /** Get the complete list of types for this resultset */
    var aggregates = resultset.getSubjectsByType("http://purl.org/ontology/aggregate#Aggregate");
    var typesAggregates = resultset.getSubjectsByPredicateObjectValue("http://purl.org/ontology/aggregate#property", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", aggregates);
    var types = [];     
        
    // Re-initialize some of the properties of the filters types
    for(var ft = 0; ft < self.filtersTypes.length; ft++)
    {
      self.filtersTypes[ft].selected = false;
      self.filtersTypes[ft].nbRecords = 0;
    }          
        
    for(var ta = 0; ta < typesAggregates.length; ta++)   
    {
      var typeAggregate = typesAggregates[ta];

      var typeURI = typeAggregate.predicate[1]["http://purl.org/ontology/aggregate#object"].uri;
      var nbRecords = typeAggregate.predicate[2]["http://purl.org/ontology/aggregate#count"];
      var prefLabel = typeURI;
      
      for(var s = 0; s < self.schemas.length; s++)
      {
        var type = self.schemas[s].getType(typeURI);
        
        if(type != null)
        {
          prefLabel = type.prefLabel;
          break;
        }
      }
      
      if(type == null)
      {
        if(typeURI.lastIndexOf("#") != -1)
        {
          prefLabel = typeURI.substring(typeURI.lastIndexOf("#") + 1).replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, '');
        }
        else if(typeURI.lastIndexOf("/") != -1)
        {
          prefLabel = typeURI.substring(typeURI.lastIndexOf("/") + 1).replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, '');
        }
      }
      
      var checkboxSelected = false;
      
      if(self.checkedFiltersTypes.indexOf(typeURI) != -1)
      {
        checkboxSelected = true;
      }
      
      var found = false;
      
      for(var i = 0; i < self.filtersTypes.length; i++)
      {
        if(self.filtersTypes[i].uri == typeURI)
        {
          self.filtersTypes[i].selected = checkboxSelected;
          self.filtersTypes[i].nbRecords = nbRecords;
          
          found = true;
        }
      }
      
      if(found == false)
      {
        self.filtersTypes.push({
          prefLabel: prefLabel, 
          nbRecords: nbRecords, 
          uri:typeURI, 
          selected:checkboxSelected
        });              
      } 
    }        

    /** Get the complete list of attributes for this resultset */      
    var aggregates = resultset.getSubjectsByType("http://purl.org/ontology/aggregate#Aggregate");
    var attributesAggregates = resultset.getSubjectsByPredicateObjectValue("http://purl.org/ontology/aggregate#property", "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property", aggregates);
    var attributes = [];  

    // Re-initialize some of the properties of the filters attributes
    for(var fa = 0; fa < self.filtersAttributes.length; fa++)
    {
      self.filtersAttributes[fa].selected = false;
      self.filtersAttributes[fa].nbRecords = 0;
    }          
    
    for(var ta = 0; ta < attributesAggregates.length; ta++)   
    {
      var attributeAggregate = attributesAggregates[ta];

      var attributeURI = attributeAggregate.predicate[1]["http://purl.org/ontology/aggregate#object"].uri;
      var nbRecords = attributeAggregate.predicate[2]["http://purl.org/ontology/aggregate#count"];
      var prefLabel = attributeURI;
      
      for(var s = 0; s < self.schemas.length; s++)
      {
        var attribute = self.schemas[s].getAttribute(attributeURI);
        
        if(attribute != null)
        {
          prefLabel = attribute.prefLabel;
          break;
        }
      }
      
      if(attribute == null)
      {
        if(attributeURI.lastIndexOf("#") != -1)
        {
          prefLabel = attributeURI.substring(attributeURI.lastIndexOf("#") + 1).replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, '');
        }
        else if(attributeURI.lastIndexOf("/") != -1)
        {
          prefLabel = attributeURI.substring(attributeURI.lastIndexOf("/") + 1).replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, '');
        }
      }
      
      var checkboxSelected = false;
      
      if(self.checkedFiltersAttributes.indexOf(attributeURI) != -1)
      {
        checkboxSelected = true;
      }
      
      var found = false;
      
      for(var i = 0; i < self.filtersAttributes.length; i++)
      {
        if(self.filtersAttributes[i].uri == attributeURI)
        {
          self.filtersAttributes[i].selected = checkboxSelected;
          self.filtersAttributes[i].nbRecords = nbRecords;
          
          found = true;
        }
      }
      
      if(found == false)
      {
        self.filtersAttributes.push({
          prefLabel: prefLabel, 
          nbRecords: nbRecords, 
          uri:attributeURI, 
          selected:checkboxSelected
        });              
      } 
    }
    
    self.results = [];
    
    /** Calculate the number of results for this resultset */
    if(self.automaticallyTagOneResult)
    {
      var resultsWithoutAggregates = 0;
      
      for(var s = 0; s < resultset.subjects.length; s++)   
      {   
        var subject = resultset.subjects[s];
        
        if(subject.type != "http://purl.org/ontology/aggregate#Aggregate")
        {
          resultsWithoutAggregates++;
        }
      }
    }
    
    var singleRecordGotTagged = false;
    
    for(var s = 0; s < resultset.subjects.length; s++)   
    {   
      var subject = resultset.subjects[s];
      
      if(subject.type == "http://purl.org/ontology/aggregate#Aggregate" &&
         subject.getPredicateValues("http://purl.org/ontology/aggregate#property")[0].uri == "http://rdfs.org/ns/void#Dataset")
      {
        self.nbResults += parseInt(subject.getPredicateValues("http://purl.org/ontology/aggregate#count")[0]); 
      }
      
      if(subject.type != "http://purl.org/ontology/aggregate#Aggregate")
      {
        var htmlSubject = self.getResultDefinition(subject);  
        
        self.results.push(htmlSubject);
         
        if(self.automaticallyTagOneResult)
        {     
          if(resultsWithoutAggregates == 1)
          {
            var found = false;
            
            for(var is = 0; is < self.taggedRecords.length; is++)
            {
              if(self.taggedRecords[is] == subject.uri)
              {
                found = true;
                break;
              }
            }
            
            if(!found)
            {
              self.taggedRecords.push(subject.uri);
              self.taggedResults.push(htmlSubject);
              
              singleRecordGotTagged = true;
            }
          }
        }
      }              
    }     
    
    if(this.displayResultsHTML)
    {
      if(!self.displayFiltersByDefault || self.dataRequestedByUser)
      {
        self.displayResultsPagination(self.nbResults, self.currentResultsetPage); 
        
        self.displayResults();
      }
      else
      {
        $("#resultsBox").html('<p id="searchOrFilterExplanationText">Perform Search or select Sources or Kinds filters to right to populate results</span>');
        //$("#resultsBox").append('<div class="noSearchResults">No results for the <b>"'+($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val())+'"</b> search keywords and for this this.map region and selected filters. <br /><br />You can try zooming-out the this.map to get this.results elsewhere in the city.</div>');  
      }
      
      self.displayTaggedRecords(this.taggedResults);
      
      if(this.displayFilters)
      {
        self.displayFiltersDataset();
        
        self.displayFiltersType();
        
        self.displayFiltersAttribute();
      }
      else
      {
        $(".webMapFiltersTd").hide(); 
      }
    }

    if(self.queryFocusWindowOnly)
    {
      self.hideUntaggedRecords();        
    }
 
    /** Show/add markers for the records in the filtered resultset */
    for(var s = 0; s < resultset.subjects.length; s++)   
    {   
      var subject = resultset.subjects[s];
      
      if(subject.type != "http://purl.org/ontology/aggregate#Aggregate")
      {
        /** Make sure this marker is not already displayed on the map */
        var found = false;
        
        for(var m = 0; m < self.markers.length; m++)   
        {
          var marker = self.markers[m];
          
          if(marker.data.uri == subject.uri &&
             targetMap.getDiv().id == marker.map.getDiv().id)
          {
            found = true;
            marker.setVisible(true);
            break;
          }
        }
        
        if(!found)
        {
          /** Display markers on the map */
          var lat = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#lat");
          var lg = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#long");
          
          if(lat.length == 1 && lg.length == 1)
          {
            var iconUrl = "";
           
            for(var sh = 0; sh < self.schemas.length; sh++)
            {
              var type = self.schemas[sh].getType(subject.type);
              
              if(type != null)
              {
                if(type.mapMarkerImageUrl != undefined &&
                   type.mapMarkerImageUrl != null)
                {
                  iconUrl = type.mapMarkerImageUrl[0];               
                  break;
                }
              }
            }
            
            if(iconUrl == "" && this.defaultMarkerUrl != "")
            {
              iconUrl = this.defaultMarkerUrl;
            }
            
            var markerOptions;
            
            if(iconUrl != "")
            {
              markerOptions = {
                  icon: iconUrl,
                  position: new google.maps.LatLng(lat[0], lg[0]),
                  map: targetMap,
                  title: self.stripHtml(subject.getPrefLabel())
              };
            }
            else
            {
              markerOptions = {
                  position: new google.maps.LatLng(lat[0], lg[0]),
                  map: targetMap,
                  title: self.stripHtml(subject.getPrefLabel())
              };
            }
              
            var marker = new google.maps.Marker(markerOptions);                
              
            marker.data = subject;

            google.maps.event.addListener(marker, 'mouseover', function() {
              self.featureOver(this.data.uri);
            });             
            
            if(this.enableDirectionsService)
            {
              google.maps.event.addListener(marker, 'rightclick', function(event) {
                
                self.showMarkerContextMenu(event.latLng, this);              
                
              });             
            }
            
            self.markers.push(marker);
          }
        }
        
        /** Make sure self polygon is not already displayed on the map */
        if(!found)
        {
          for(var p = 0; p < self.polygons.length; p++)   
          {
            var polygon = self.polygons[p];
            
            if(polygon.data.uri == subject.uri)
            {
              found = true;
              polygon.setMap(targetMap);
            }
          }              
          
          if(!found)
          {
            /** Display polygons on the this.map */
            var polygonCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polygonCoordinates");
            
            // Get possible color for the polygon
            
            // First check if there is a color defined for this specific record.
            // If there is none, then we check if there is one associated
            // with the type of the record.
            
            var color = "#CA2251";
            
            var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
            
            if(scoColor.length > 0)
            {
              color = scoColor[0];
            }
            else
            {
              for(var ss = 0; ss < self.schemas.length; ss++)
              {
                var polygonType = self.schemas[ss].getType(subject.type);
                
                if(polygonType != null)
                {              
                  if(polygonType.color != null)
                  {
                    color = polygonType.color[0];
                  }
                }
              }
            }
            
            var firstPosition = null;
            
            for(var pc = 0; pc < polygonCoordinates.length; pc++)   
            {
              var polygonCoordinate = polygonCoordinates[pc];
              
              var rawPoints = polygonCoordinate.split(" ");
              
              var polygonPoints = [];
              
              var polygonLatLngBounds = new google.maps.LatLngBounds();                
              
              for(var pt = 0; pt < rawPoints.length; pt++)   
              {
                var point = rawPoints[pt];
                
                var points = point.split(",");
                
                polygonPoints.push(new google.maps.LatLng(points[1], points[0]));
                
                polygonLatLngBounds = polygonLatLngBounds.extend(new google.maps.LatLng(points[1], points[0]));
                
                if(firstPosition == null)
                {
                  firstPosition = new google.maps.LatLng(points[1], points[0]);
                }
              }
                     
              
              var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.05
              });
              
              polygon.data = subject;
              polygon.bounds = polygonLatLngBounds;

              var boxText = document.createElement("div");
              boxText.style.cssText = "font-weight: bolder; border: 1px solid #3366CC; margin-top: 8px; background: #3366CC; padding: 3px; color: black;";                        
              boxText.innerHTML = subject.getPrefLabel();
                      
              var myOptions = { content: boxText,
                                disableAutoPan: true,
                                maxWidth: 0,
                                pixelOffset: new google.maps.Size(0, 10),
                                zIndex: null,
                                boxStyle: { 
                                  background: "",
                                  opacity: 0.90
                                },
                                closeBoxMargin: "10px 2px 2px 2px",
                                closeBoxURL: "",
                                infoBoxClearance: new google.maps.Size(1, 1),
                                isHidden: true,
                                pane: "floatPane",
                                enableEventPropagation: false};


              var ib = new InfoBox(myOptions);
              
              ib.open(targetMap);
              
              polygon.infobox = ib;
              
              // Add a listener for displaying tooltips for the this.polygons
              google.maps.event.addListener(polygon, 'mouseout', function() {
                this.infobox.hide();
              });
              
              google.maps.event.addListener(polygon, 'mouseover', function(e) {
                this.infobox.show();
                self.featureOver(this.data.uri);
              });

              google.maps.event.addListener(polygon, 'mousemove', function(e) {
                this.infobox.setPosition(e.latLng);
              });

              
              self.polygons.push(polygon);
              
              polygon.setMap(targetMap);  
              
              found = true;   
            }   
          }
        }
        
        /** Make sure this this.polylines is not already displayed on the this.map */
        if(!found)
        {
          for(var pl = 0; pl < self.polylines.length; pl++)   
          {
            var polyline = self.polylines[pl];
            if(polyline.data.uri == subject.uri)
            {
              found = true;
              polyline.setMap(targetMap);
            }
          }              
          
          if(!found)
          {
            /** Display this.polygons on the this.map */
            var polylineCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polylineCoordinates");
            
            // First check if there is a color defined for this specific record.
            // If there is none, then we check if there is one associated
            // with the type of the record.
            
            var color = "#CA2251";
            
            var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
            
            if(scoColor.length > 0)
            {
              color = scoColor[0];
            }
            else
            {            
              for(var ss = 0; ss < self.schemas.length; ss++)
              {
                var polylineType = self.schemas[ss].getType(subject.type);
                
                if(polylineType != null)
                {              
                  if(polylineType.color != null)
                  {
                    color = polylineType.color[0];
                  }
                }
              }            
            }
            
            for(var pc = 0; pc < polylineCoordinates.length; pc++)   
            {     
              var polylineCoordinate = polylineCoordinates[pc];
              
              var rawPoints = polylineCoordinate.split(" ");
              
              var polylinePoints = [];
              
              var polylineLatLngBounds = new google.maps.LatLngBounds(); 
              
              for(var pt = 0; pt < rawPoints.length; pt++)
              {        
                var point = rawPoints[pt];
                
                var points = point.split(",");
                
                polylinePoints.push(new google.maps.LatLng(points[1], points[0]));
                
                polylineLatLngBounds = polylineLatLngBounds.extend(new google.maps.LatLng(points[1], points[0]));
                
                if(firstPosition == null)
                {
                  firstPosition = new google.maps.LatLng(points[1], points[0]);
                }                  
              }
           
              var polyline = new google.maps.Polyline({
                path: polylinePoints,
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.05
              });
              
              polyline.data = subject;                
              
              polyline.bounds = polylineLatLngBounds;

              var boxText = document.createElement("div");
              boxText.style.cssText = "font-weight: bolder; border: 1px solid #3366CC; margin-top: 8px; background: #3366CC; padding: 3px; color: black;";                        
              boxText.innerHTML = subject.getPrefLabel();
                      
              var myOptions = { content: boxText,
                                disableAutoPan: true,
                                maxWidth: 0,
                                pixelOffset: new google.maps.Size(0, 10),
                                zIndex: null,
                                boxStyle: { 
                                  background: "",
                                  opacity: 0.90
                                },
                                closeBoxMargin: "10px 2px 2px 2px",
                                closeBoxURL: "",
                                infoBoxClearance: new google.maps.Size(1, 1),
                                isHidden: true,
                                pane: "floatPane",
                                enableEventPropagation: false};


              var ib = new InfoBox(myOptions);
              
              ib.open(targetMap);
              
              polyline.infobox = ib;
              
              // Add a listener for displaying tooltips for the this.polygons
              
              google.maps.event.addListener(polyline, 'mouseout', function() {
                this.infobox.hide();
              });
              
              google.maps.event.addListener(polyline, 'mouseover', function() {
                this.infobox.show();
                self.featureOver(this.data.uri);
              });
              
              google.maps.event.addListener(polyline, 'mousemove', function(e) {
                this.infobox.setPosition(e.latLng);
              });              
              
              self.polylines.push(polyline);
              
              polyline.setMap(targetMap);   
              
              found = true;             
            }   
          }
        }          
      }
    }
    
    if(singleRecordGotTagged && self.searchPlugins.length > 1 && self.searchPlugins[$('#searchPluginsSelect').val()].reach.toLowerCase() == "global")  
    {
      self.zoomToTaggedRecords();
      
      // If the zoom is too close, we outzoom it a bit
      if(self.map.getZoom() > 16)
      { 
        self.map.setZoom(16);
      }
    }
    
    if(self.searchPlugins.length > 1 && 
       self.searchPlugins[$('#searchPluginsSelect').val()].autoswitch != "" &&
       $('#searchInput').val() != "Search Map")
    {
      for(var i = 0; i < self.searchPlugins.length; i++)
      {
        if(self.searchPlugins[$('#searchPluginsSelect').val()].autoswitch.toLowerCase() == self.searchPlugins[i].name.toLowerCase())
        {
          $('#searchInput').val('');
          $('#searchPluginsSelect').val(i);
          $('#searchPluginsSelect').change();
          break;
        }
      }
      
    }
    
    self.stopWaiting();     
  }
  
  this.getCanvasXY = function getCanvasXY(caurrentLatLng, marker){  
    var scale = Math.pow(2, marker.map.getZoom());
    var nw = new google.maps.LatLng(marker.map.getBounds().getNorthEast().lat(), marker.map.getBounds().getSouthWest().lng());
    var worldCoordinateNW = marker.map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = marker.map.getProjection().fromLatLngToPoint(caurrentLatLng);
    var caurrentLatLngOffset = new google.maps.Point(
      Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
      Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    
    return caurrentLatLngOffset;
  }
  
  this.setMenuXY = function setMenuXY(caurrentLatLng, marker){
    var mapWidth = /*$('#map_canvas').width();*/ marker.map.getDiv().clientWidth;
    var mapHeight = /*$('#map_canvas').height();*/ marker.map.getDiv().clientWidth;
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = this.getCanvasXY(caurrentLatLng, marker);
    var x = clickedPosition.x ;
    var y = clickedPosition.y ;

    if((mapWidth - x ) < menuWidth)
    {
      x = x - menuWidth;
    }
    
    if((mapHeight - y ) < menuHeight)
    {
      y = y - menuHeight;
    }

    $('.contextmenu').css('left', x);
    $('.contextmenu').css('top', y);
  };
    
  this.showMarkerContextMenu = function showMarkerContextMenu(caurrentLatLng, marker) {
    
    var projection;
    var contextmenuDir;
    
    projection = marker.map.getProjection() ;
    
    $('.contextmenu').remove();
    
    contextmenuDir = document.createElement("div");
    contextmenuDir.className  = 'contextmenu';
    contextmenuDir.innerHTML = "<a id='markerContextMenu_DirectionsFromHere'>\
                                  <div class=context>Directions from here<\/div>\
                                <\/a>\
                                <a id='markerContextMenu_DirectionsToHere'>\
                                  <div class=context>Directions to here<\/div>\
                                <\/a>";
    
    $(marker.map.getDiv()).append(contextmenuDir);
        
    this.setMenuXY(caurrentLatLng, marker);

    contextmenuDir.style.visibility = "visible";
    
    $('#markerContextMenu_DirectionsFromHere').click(function(){
      $('.contextmenu').remove();
      
      self.directionsFromHere = marker.getPosition();
      
      if(self.directionsToHere)      
      {
        self.calculateDirections();
      }
    });
    
    $('#markerContextMenu_DirectionsToHere').click(function(){
      $('.contextmenu').remove();
      
      self.directionsToHere = marker.getPosition();
      
      if(self.directionsFromHere)
      {
        self.calculateDirections();
      }       
    });
    
    google.maps.event.addListenerOnce(marker.map, 'click', function(){
      $('.contextmenu').remove();
    });
    
  }  
  
  this.calculateDirections = function calculateDirections() {
    
    if(!self.directionsFromHere) 
    {
      alert("Select a marker where to start getting directions");
      return;
    }
    
    if(!self.directionsToHere) 
    {
      alert("Select a marker where to end getting directions");
      return;
    }
    
    // Check if we show the traffic on the main map
    if(self.directionsShowTrafficLayer)
    {
      if(document.getElementById('traffic').checked)
      {
        if(!self.trafficLayer)
        {
          self.trafficLayer = new google.maps.TrafficLayer();
        }      
        
        self.trafficLayer.setMap(self.map);
      }
      else
      {
        self.trafficLayer.setMap(null);
      }
    }
    
    var mode;
    switch ($('#directionsMode').val()) {
      case "bicycling":
        mode = google.maps.DirectionsTravelMode.BICYCLING;
        break;
      case "driving":
        mode = google.maps.DirectionsTravelMode.DRIVING;
        break;
      case "walking":
        mode = google.maps.DirectionsTravelMode.WALKING;
        break;
    }
    
    var request = {
        origin: self.directionsFromHere,
        destination: self.directionsToHere,
        /*waypoints: waypoints,*/
        travelMode: mode,
        /*optimizeWaypoints: document.getElementById('optimize').checked,*/
        /*avoidHighways: document.getElementById('highways').checked,
        avoidTolls: document.getElementById('tolls').checked*/
    };
    
    self.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        self.openDirectionsOverlay();
        self.directionsDisplay.main.setDirections(response);
        if(self.enableFocusWindows)
        {
          self.directionsDisplay["focus"+self.selectedFocusMapID].setDirections(response);
        }
      }
    });
  }  

  /**
  * Remove all the HTML elements from a string
  * @param html text string that may contain HTML elements to strip
  */
  this.stripHtml = function stripHtml(html) {
     var tmp = document.createElement("DIV");
     tmp.innerHTML = html;
     return tmp.textContent||tmp.innerText;
  }
           
  /**
  * Display all the records that have been tagged, both in the tagged record section
  * of the resultset, and on that map (markers, polygons and polylines)
  * 
  * @param subjects the structXML subjects representation of the tagged records
  */
  this.displayTaggedRecords = function displayTaggedRecords(subjects) {
    this.taggedResults = subjects;
    
    /* Delete all previously inserted results */
    $(".result-tag").remove();
    
    $('#taggedRecordsBox').show();
    
    if(subjects.length > 0)
    {
      $("#taggedRecordsBox").append('<div id="showSelectedRecordsOnlyDiv" class="result-tag"><span>Show selected records only <input type="checkbox" name="showSelectedRecordsOnlyCheckbox" id="showSelectedRecordsOnlyCheckbox" title=""></span></div>'); 
      
      $('#showSelectedRecordsOnlyCheckbox').click(function(){
        if(this.checked != undefined)
        {
          if(this.checked)
          {      
            self.clearMap();  
          }
          else
          {
//            self.dataRequestedByUser = true;
            self.forceAllFocusWindowsSearch = false;
            self.search();
          }
        }
      });
    }
    else
    {
      $('#showSelectedRecordsOnlyDiv').remove();
    }
    
    for(var i = 0; i < subjects.length; i++)
    {
      var subjectResultset = subjects[i].resultset;
      
      var templateData = {};
      
      for(var u = 0; u < subjectResultset.predicate.length; u++)
      {
        for(var predicate in subjectResultset.predicate[u])
        {                                                                    
          if(subjectResultset.predicate[u][predicate].uri != undefined)
          {
            templateData[predicate.replace(":", "_").replace(/[^A-Za-z0-9_-]/g, "-")] = subjectResultset.predicate[u][predicate].uri;
          }
          else
          {
            templateData[predicate.replace(":", "_").replace(/[^A-Za-z0-9_-]/g, "-")] = subjectResultset.predicate[u][predicate];
          }
        }
      }    
      
      // add the generic property "uri" to be able to refer to the URI of the record in the template
      templateData["record-uri"] = subjectResultset.uri;
      
      this.templatesData.push(templateData);      
      
      if(this.taggedRecords.indexOf(subjects[i].uri) == -1)
      {
        this.taggedRecords.push(subjects[i].uri);
      }
      
      /* Add the result container */
      $("#taggedRecordsBox").append('<div id="tagged_result_' + i + '" class="result-tag"></div>');    
     
      $('#tagged_result_' + i).mouseover(function(){
        
        var id = this.id.substring(this.id.lastIndexOf("_") + 1);
        self.recordOver(self.taggedRecords[id]);
        
      }).mouseout(function(){
        
        var id = this.id.substring(this.id.lastIndexOf("_") + 1);
        self.recordOut(self.taggedRecords[id]);
        
      });     
     
      $("#tagged_result_"+i).append('<table class="taggedResultTable"><tr><td id="tagged_result_column_left_'+i+'" class="resultLeftColumn"></td><td id="tagged_result_column_image_'+i+'" class="resultImageColumn"></td><td id="tagged_result_column_center_'+i+'"  class="resultCenterColumn"></td><td id="tagged_result_column_right_'+i+'" class="resultRightColumn"></td></tr></div>');

      $("#tagged_result_column_left_"+i).append(this.letters[i]+'. '); 
      
      // Display the marker/polygon/polyline image
      if(subjects[i].markerImageUrl != "")
      {
        $("#tagged_result_column_image_"+i).attr("title", subjects[i].typePrefLabel);
        $("#tagged_result_column_image_"+i).append('<img src="'+subjects[i].markerImageUrl+'" />'); 
      }
      else if(subjects[i].polygonColor != "")
      {
        $("#tagged_result_column_image_"+i).attr("title", subjects[i].typePrefLabel);                       
        $("#tagged_result_column_image_"+i).append('<div id="tagged_result_column_canvas_'+i+'" style="top:-3px;left:20px;position:relative;width:60px;height:30px;"></div>');
        
        //Create jsGraphics object
        var gr = new jsGraphics(document.getElementById("tagged_result_column_canvas_" + i));

        //Create jsColor object
        var col = new jsColor(subjects[i].polygonColor.replace("0x", "#"));
        
        gr.fillPolygon(col, [new jsPoint(3,5),new jsPoint(11,6),new jsPoint(17,9),new jsPoint(15,17),new jsPoint(12,21),new jsPoint(17,22),new jsPoint(21,27),new jsPoint(15,31),new jsPoint(6,28),new jsPoint(1,25),new jsPoint(-1,14)]);
      }
      else if(subjects[i].polylineColor != "")
      {
        $("#tagged_result_column_image_"+i).attr("title", subjects[i].typePrefLabel);
        $("#tagged_result_column_image_"+i).append('<div id="tagged_result_column_canvas_'+i+'" style="top:-3px;left:20px;position:relative;width:60px;height:30px;"></div>');
        
        //Create jsGraphics object
        var gr = new jsGraphics(document.getElementById("tagged_result_column_canvas_" + i));

        var col = new jsColor(subjects[i].polylineColor.replace("0x", "#"));
        var pen = new jsPen(col,2);

        gr.drawPolyline(pen, [new jsPoint(2,2),new jsPoint(13,8),new jsPoint(5,17),new jsPoint(19,18)]);
      }
      else
      {
        $("#tagged_result_column_image_"+i).attr("title", subjects[i].typePrefLabel);
        $("#tagged_result_column_image_"+i).append('<img src="'+this.defaultMarkerUrl+'" />'); 
      }
      
      if(this.isAdmin)
      {
        var recordData = "";
        for(var attr in this.templatesData[i])
        {
          recordData += attr + " = " + this.templatesData[i][attr].replace(/"/, '').replace(/'/, '') + "\\n";
        }
        
        $("#tagged_result_column_right_"+i).append('<img title="See record data (used for templating purposes)" src="'+this.imagesFolder+'application_form_edit.png" onclick="alert(\''+recordData+'\');" style="cursor:pointer; padding-right: 3px;" />'); 
      }
      
      if(this.enableRecordSelection)
      {
        $("#tagged_result_column_right_"+i).append('<input type="checkbox" name="tagged_result_checkbox_' + i + '" title="Keep this result" checked>'); 
        
        $("#tagged_result_column_right_" + i + " > input").click(function() {
          var id = this.parentNode.id.substring(this.parentNode.id.lastIndexOf("_") + 1);
          self.tagRecord(this, subjects[id].uri);
        });  
      }
      
      if(templates[subjects[i].type] != undefined)
      {
        $("#tagged_result_column_center_"+i).append(templates[subjects[i].type]);
        
        if(typeof(templatesDirectives) != "undefined" && templatesDirectives[subjects[i].type] != undefined)
        {
          $("#tagged_result_column_center_"+i+" > div").autoRender(templateData, templatesDirectives[subjects[i].type]);
        }
        else
        {
          $("#tagged_result_column_center_"+i+" > div").autoRender(templateData);
        }
        
        // Remove empty <a> links to clean the templated result.
        $("#tagged_result_column_center_"+i+" > div a[href='']").remove();
        
        // Remove empty <img> images elements to clean the templated result.
        $("#tagged_result_column_center_"+i+" > div img[src='']").remove();
        
        $("#tagged_result_column_center_"+i).find('.resultTitle').data('id', i);
        
        $("#tagged_result_column_center_"+i).find('.resultTitle').click(function (){
          if(self.enableRecordDisplayOverlay)
          {
            self.openRecordDescriptionOverlay($(this).data('id'), true);  
          }
          else
          {
            window.open(self.taggedResults[$(this).data('id')].uri, '_blank');
          }
        });
      }
      else
      {
        $("#tagged_result_column_center_"+i).append('<div class="resultTitle"><a>' + subjects[i].prefLabel + '</a></div>');
        $("#tagged_result_column_center_"+i).append('<div class="resultDescription">' + subjects[i].description + '</div>');
        
        $("#tagged_result_column_center_"+i+" > div > a").click(function (){
          var id = this.parentNode.parentNode.id.substring(this.parentNode.parentNode.id.lastIndexOf("_") + 1);          
          
          if(self.enableRecordDisplayOverlay)
          {
            self.openRecordDescriptionOverlay(id, true);  
          }
          else
          {
            window.open(self.taggedResults[id].uri, '_blank');
          }          
        });
      }    
      
      $('#tagged_result_' + i).mouseover(function(){
        var id = this.id.substring(this.id.lastIndexOf("_") + 1);
      }).mouseout(function(){
        var id = this.id.substring(this.id.lastIndexOf("_") + 1);
      });  
    }
  }

  /**
  * Triggered when the mouse of the user over a marker, polygon or polyline on the map
  * 
  * @param uri URI of the record that is being moused over
  */
  this.featureOver = function featureOver(uri) {
    for(var i = 0; i < this.taggedRecords.length; i++)
    {
      if(this.taggedRecords[i] == uri)
      {
        $("#webMapResults").scrollTo('#tagged_result_' + i);  
        
        this.highlightTaggedResult(i);
        
        return;
      }
    }
    
    for(var i = 0; i < this.results.length; i++)
    {
      if(this.results[i].uri == uri)
      {
        $("#webMapResults").scrollTo("#result_"+i);  
        this.highlightResult(i);
        
        return;
      }
    }
  }
  
  /**
  * Triggered when the mouse of the user over a record in the resultset list
  * 
  * @param uri URI of the record that is being moused over
  */  
  this.recordOver = function recordOver(uri) {
    for(var m = 0; m < this.markers.length; m++)   
    {
      var marker = this.markers[m];
      
      if(marker.data.uri == uri)
      {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        
        return;
      }
    }
    
    for(var p = 0; p < this.polygons.length; p++)   
    {
      var polygon = this.polygons[p];
      
      if(polygon.data.uri == uri)
      {
        polygon.setOptions({
                    strokeColor: "#99CCFF",
                    fillColor: "#99CCFF"
        });
        
        return;
      }
    }  
    
    for(var p = 0; p < this.polylines.length; p++)   
    {
      var polyline = this.polylines[p];
      
      if(polyline.data.uri == uri)
      {
        polyline.setOptions({
                    strokeColor: "#99CCFF",
                    fillColor: "#99CCFF"
        });
        
        return;
      }
    }    
  }

  /**
  * Triggered when the mouse of the user moves out of a record in the resultset list
  * 
  * @param uri URI of the record that is being moused out
  */    
  this.recordOut = function recordOut(uri) {
    for(var m = 0; m < this.markers.length; m++)   
    {
      var marker = this.markers[m];
      
      if(marker.data.uri == uri)
      {
        marker.setAnimation(null);
        
        return;
      }
    }
    
    for(var p = 0; p < this.polygons.length; p++)   
    {
      var polygon = this.polygons[p];
      
      if(polygon.data.uri == uri)
      {                 
        // First check if there is a color defined for this specific record.
        // If there is none, then we check if there is one associated
        // with the type of the record.
        var color = "#CA2251";
        
        var scoColor = polygon.data.getPredicateValues("http://purl.org/ontology/sco#color");
        
        if(scoColor.length > 0)
        {
          color = scoColor[0];
        }
        else
        {
          for(var s = 0; s < self.schemas.length; s++)
          {
            var polygonType = self.schemas[s].getType(polygon.data.type);
            
            if(polygonType != null)
            {              
              if(polygonType.color != null)
              {
                color = polygonType.color[0];
              }
            }
          }      
        }
                 
        polygon.setOptions({
                    strokeColor: color,
                    fillColor: color
        });
        
        return;
      }
    }  
    
    for(var p = 0; p < this.polylines.length; p++)   
    {
      var polyline = this.polylines[p];
      
      if(polyline.data.uri == uri)
      {                       
        // First check if there is a color defined for this specific record.
        // If there is none, then we check if there is one associated
        // with the type of the record.
        
        var color = "#CA2251";
        
        var scoColor = polyline.data.getPredicateValues("http://purl.org/ontology/sco#color");
        
        if(scoColor.length > 0)
        {
          color = scoColor[0];
        }
        else
        {
          for(var s = 0; s < self.schemas.length; s++)
          {
            var polylineType = self.schemas[s].getType(polyline.data.type);
            
            if(polylineType != null)
            {              
              if(polylineType.color != null)
              {
                color = polylineType.color[0];
              }
            }
          }            
        }
           
        polyline.setOptions({
                    strokeColor: color,
                    fillColor: color
        });
        
        return;
      }
    }    
  }
  
  /**
  * Display all the results in the resultset section of the sWebMap control. All the displayed
  * results are the ones that exists in the "results" array.
  */
  this.displayResults = function displayResults() { 
    /* Delete all previously inserted this.results */
    $(".result-odd").remove();
    $(".result-even").remove();
    $(".result-highlight").remove();
    $(".noSearchResults").remove();
    
    var counter = 0;
    
    if(this.results.length == 0)
    {
      if(this.taggedRecords.length <= 0 && !this.mapLoading)
      {
        if(this.enableFocusWindows)
        {
          $("#resultsBox").html('<div class="noSearchResults">No results for the <b>\
                                   "'+($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val())+'"\
                                   </b> \
                                   search keywords and for this focus map region and selected filters. \
                                   <br /><br />\
                                   You can try zooming-out the map to get results elsewhere in the city.\
                                   <br /><br />\
                                   You can also try to select another focus window to see if results for that search\
                                   query exist for their region.\
                                   </div>');  
        }
        else
        {
          $("#resultsBox").html('<div class="noSearchResults">No results for the <b>\
                                   "'+($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val())+'"\
                                   </b> \
                                   search keywords and for this map region and selected filters. \
                                   <br /><br />\
                                   You can try zooming-out the map to get results elsewhere in the city.\
                                   </div>');  
        }
      }
    }
    else
    {
      this.templatesData = [];
      
      $("#resultsBox").html('');
      
      for(var i = 0; i < this.results.length; i++)
      {  
        // Make sure the result is not tagged (so already appearing in the list)
        if(this.taggedRecords.indexOf(this.results[i].uri) >= 0)
        {
          continue;
        }      

        var subjectResultset = this.results[i].resultset;
        
        var templateData = {};       
        
        for(var u = 0; u < subjectResultset.predicate.length; u++)
        {
          for(var predicate in subjectResultset.predicate[u])
          {
            if(subjectResultset.predicate[u][predicate].uri != undefined)
            {
              templateData[predicate.replace(":", "_").replace(/[^A-Za-z0-9_-]/g, "-")] = subjectResultset.predicate[u][predicate].uri;
            }
            else
            {
              if((typeof (subjectResultset.predicate[u][predicate]) == 'object' && 
                  'value' in subjectResultset.predicate[u][predicate]))
              {              
                templateData[predicate.replace(":", "_").replace(/[^A-Za-z0-9_-]/g, "-")] = subjectResultset.predicate[u][predicate].value;
              }
              else
              {
                templateData[predicate.replace(":", "_").replace(/[^A-Za-z0-9_-]/g, "-")] = subjectResultset.predicate[u][predicate];
              }
            }
          }
        }    
        
        // add the generic property "uri" to be able to refer to the URI of the record in the template
        templateData["record-uri"] = subjectResultset.uri;        
        
        this.templatesData.push(templateData);  
        
        var found = false;  
        for(var ii = 0; ii < this.taggedRecords.length; ii++)
        {
          if(this.taggedRecords[ii].uri == this.results[i].uri)
          {
            found = true;
            break;
          }
        }
        
        if(found)
        {
          continue;
        }
        
        counter++;
        
        /* Add the result container */
        if(i % 2 == 0)
        {
          $("#resultsBox").append('<div id="result_' + i + '" class="result-even"></div>');    
        }
        else
        {
          $("#resultsBox").append('<div id="result_' + i + '" class="result-odd"></div>');    
        }

        $("#result_"+i).append('<table class="resultTable"><tr><td id="result_column_left_'+i+'" class="resultLeftColumn"></td><td id="result_column_image_'+i+'" class="resultImageColumn"></td><td id="result_column_center_'+i+'"  class="resultCenterColumn"></td><td id="result_column_right_'+i+'" class="resultRightColumn"></td></tr></div>');

        if($.cookie('webmap-resultsperpage') != null)
        {
          this.mapResultsPerPage = $.cookie('webmap-resultsperpage');
        }
        
        $("#result_column_left_"+i).append(((counter) + (this.currentResultsetPage * this.mapResultsPerPage))+'. '); 
        
        // Display the marker/polygon/polyline image
        if(this.results[i].markerImageUrl != "")
        {
          $("#result_column_image_"+i).attr("title", this.results[i].typePrefLabel);
          $("#result_column_image_"+i).append('<img src="'+this.results[i].markerImageUrl+'" />'); 
        }
        else if(this.results[i].polygonColor != "")
        {
          $("#result_column_image_"+i).attr("title", this.results[i].typePrefLabel);
          $("#result_column_image_"+i).append('<div id="result_column_canvas_'+i+'" style="top:-3px;left:20px;position:relative;width:60px;height:30px;"></div>');
          
          //Create jsGraphics object
          var gr = new jsGraphics(document.getElementById("result_column_canvas_" + i));

          //Create jsColor object
          var col = new jsColor(this.results[i].polygonColor.replace("0x", "#"));
          
          gr.fillPolygon(col, [new jsPoint(3,5),new jsPoint(11,6),new jsPoint(17,9),new jsPoint(15,17),new jsPoint(12,21),new jsPoint(17,22),new jsPoint(21,27),new jsPoint(15,31),new jsPoint(6,28),new jsPoint(1,25),new jsPoint(-1,14)]);
        }
        else if(this.results[i].polylineColor != "")
        {
          $("#result_column_image_"+i).attr("title", this.results[i].typePrefLabel);
          $("#result_column_image_"+i).append('<div id="result_column_canvas_'+i+'" style="top:-3px;left:20px;position:relative;width:60px;height:30px;"></div>');
          
          //Create jsGraphics object
          var gr = new jsGraphics(document.getElementById("result_column_canvas_" + i));

          var col = new jsColor(this.results[i].polylineColor.replace("0x", "#"));
          var pen = new jsPen(col,2);

          gr.drawPolyline(pen, [new jsPoint(2,2),new jsPoint(13,8),new jsPoint(5,17),new jsPoint(19,18)]);
        }
        else
        {
          $("#result_column_image_"+i).attr("title", this.results[i].typePrefLabel);
          $("#result_column_image_"+i).append('<img src="'+this.defaultMarkerUrl+'" />');           
        }
        
        if(this.isAdmin)
        {
          var recordData = "";
          for(var attr in this.templatesData[i])
          {
            recordData += attr + " = " + this.templatesData[i][attr].replace(/"/, '').replace(/'/, '') + "\\n";
          }        
          
          $("#result_column_right_"+i).append('<img title="See record data (used for templating purposes)" src="'+this.imagesFolder+'application_form_edit.png" onclick="alert(\''+recordData+'\');" style="cursor:pointer; padding-right: 3px;" />'); 
        }
        
        if(this.enableRecordSelection)
        {
          $("#result_column_right_"+i).append('<input type="checkbox" name="result_checkbox_' + i + '" id="result_checkbox_' + i + '" title="Keep this result">'); 
          
          $("#result_column_right_" + i + " > input").click(function() {
            var id = this.parentNode.id.substring(this.parentNode.id.lastIndexOf("_") + 1);
            self.tagRecord(this, self.results[id].uri);
          });  
          
          this.displayHelpTipsHover('result_checkbox_' + i, "Keep result on map", 's');
        }
         
        if(templates[this.results[i].type] != undefined)
        {
          $("#result_column_center_"+i).append(templates[this.results[i].type]);
          
          if(typeof(templatesDirectives) != "undefined" && templatesDirectives[this.results[i].type] != undefined)          
          {                                          
            $("#result_column_center_"+i+" > div").autoRender(templateData, templatesDirectives[this.results[i].type])
          }
          else
          {
            $("#result_column_center_"+i+" > div").autoRender(templateData)
          }
        
          // Remove empty <a> links to clean the templated result.
          $("#result_column_center_"+i+" > div a[href='']").remove();
          
          // Remove empty <img> images elements to clean the templated result.
          $("#result_column_center_"+i+" > div img[src='']").remove();
        
          $("#result_column_center_"+i).find('.resultTitle').data('id', i);
        
          $("#result_column_center_"+i).find('.resultTitle').click(function (){
            if(self.enableRecordDisplayOverlay)
            {
              self.openRecordDescriptionOverlay($(this).data('id'), false);  
            }
            else
            {
              window.open(self.taggedResults[$(this).data('id')].uri, '_blank');
            }            
          });          
        }
        else
        {
          $("#result_column_center_"+i).append('<div class="resultTitle"><a>' + this.results[i].prefLabel + '</a></div>');
          $("#result_column_center_"+i).append('<div class="resultDescription">' + this.results[i].description + '</div>');
          
          $("#result_column_center_"+i+" > div > a").click(function (){
            var id = this.parentNode.parentNode.id.substring(this.parentNode.parentNode.id.lastIndexOf("_") + 1);          
            
            if(self.enableRecordDisplayOverlay)
            {
              self.openRecordDescriptionOverlay(id, false);  
            }
            else
            {
              window.open(self.taggedResults[id].uri, '_blank');
            }            
          });          
        }
        
        $('#result_' + i).mouseover(function(){
          var id = this.id.substring(this.id.lastIndexOf("_") + 1);
          
          self.recordOver(self.results[id].uri);
        }).mouseout(function(){
          var id = this.id.substring(this.id.lastIndexOf("_") + 1);
          
          self.recordOut(self.results[id].uri);
        });  
      }
      
      $("#webMapResults").scrollTo(0);  
      $("#webMapFilters").scrollTo(0);  
    }
  }

  /**
  * Tag a new record on the map.
  * 
  * @param obj The object of the HTML Element that hold the record in the resultset list. If the object is empty ("{}")
  *            then the record being tagged will get fetched from the structWSF instance because it is not part of the
  *            current resultset.
  * @param uri URI of the record to tag on the map.
  */
  this.tagRecord = function tagRecord(obj, uri) {
    $(".tipsy").remove();
    
    this.recordOut(uri);
    
    var action = "added";
    
    if(obj.checked != undefined)
    {
      if(obj.checked)
      {
        var id = obj.name.substring(obj.name.lastIndexOf("_") + 1);
        
        $('#result_'+id).remove();
        
        this.renumberResults();
         
        if(this.taggedRecords.indexOf(uri) == -1)
        {
          this.taggedRecords.push(uri);
        }
      }
      else
      {
        if(this.taggedRecords.indexOf(uri) != -1)
        {
          this.taggedRecords.splice(this.taggedRecords.indexOf(uri), 1);
          
          for(var i = 0; i < this.taggedResults.length; i++)
          {
            if(this.taggedResults[i].uri == uri)
            {
              this.taggedResults.splice(i, 1);
              break;
            }
          }
          
          action = "removed";
        }
      }
    }
    else
    {
      this.taggedRecords.push(uri);
    }
    
    // Keep track of the tagged records per focus window
    if(this.enableFocusWindows)
    {
      if(action == "added")
      {
        this.focusMapsTaggedRecords[this.selectedFocusMapID].push(uri);
      }
      else
      {
        this.focusMapsTaggedRecords[this.selectedFocusMapID].splice(this.focusMapsTaggedRecords[this.selectedFocusMapID].indexOf(uri), 1);
      }
    }
    
    if(action == "added")
    {
      // check if the tagged record exists in the this.results array.
      var found = false;
      
      for(var ii = 0; ii < this.results.length; ii++)
      {
        if(this.results[ii].uri == uri)
        {
          found = true;
          break;
        }
      }
      
      if(found)
      {
        this.taggedResults.push(this.results[ii]); 
      }
      else
      {
        // We go out to get it from the Crud Read endpoint
        unparsedResultset = $.ajax({type: "GET",
                              url: this.structWSFAddress.replace(/\/+$/,"") + "/crud/read/?uri=" + this.urlencode(uri),
                              dataType: "json",
                              async: false}).responseText;
    
        var resultset = new Resultset(JSON.parse(unparsedResultset));
        
        var subject = resultset.getSubject(uri);
        
        htmlSubject = this.getResultDefinition(subject);     
        
        //this.results.push(htmlSubject);    
        this.taggedResults.push(htmlSubject);  
        
        /** Make sure this marker is not already displayed on the map */
        var found = false;
        
        for(var m = 0; m < this.markers.length; m++)   
        {
          var marker = this.markers[m];
          
          if(marker.data.uri == subject.uri)
          {
            found = true;
            marker.setVisible(true);
            
            if(!this.enableFocusWindows)
            {
              break;
            }
          }
        }
        
        if(!found)
        {
          /** Display this.markers on the map */
          var lat = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#lat");
          var lg = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#long");
          
          if(lat.length == 1 && lg.length == 1)
          {
            var iconUrl = "";
           
            for(var sh = 0; sh < this.schemas.length; sh++)
            {
              var type = this.schemas[sh].getType(subject.type);
              
              if(type != null)
              {
                if(type.mapMarkerImageUrl != undefined &&
                   type.mapMarkerImageUrl != null)
                {
                  iconUrl = type.mapMarkerImageUrl[0];               
                  break;
                }
              }
            }
            
            if(iconUrl == "" && this.defaultMarkerUrl != "")
            {
              iconUrl = this.defaultMarkerUrl;
            }
            
            var markerOptions;
            
            if(iconUrl != "")
            {
              markerOptions = {
                  icon: iconUrl,
                  position: new google.maps.LatLng(lat[0], lg[0]),
                  map: (this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID - 1].map),
                  title: this.stripHtml(subject.getPrefLabel())
              };
            }
            else
            {
              markerOptions = {
                  position: new google.maps.LatLng(lat[0], lg[0]),
                  map: (this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID - 1].map),
                  title: this.stripHtml(subject.getPrefLabel())
              };
            }
              
            var marker = new google.maps.Marker(markerOptions);                
              
            marker.data = subject;

            google.maps.event.addListener(marker, 'mouseover', function() {
              self.featureOver(this.data.uri);
            });             

            if(this.enableDirectionsService)
            {
              google.maps.event.addListener(marker, 'rightclick', function(event) {
                
                self.showMarkerContextMenu(event.latLng, this);

              });             
            }            
            
            this.markers.push(marker);
          }
        }
        
        /** Make sure this polygon is not already displayed on the map */
        if(!found)
        {
          for(var p = 0; p < this.polygons.length; p++)   
          {
            var polygon = this.polygons[p];
            
            if(polygon.data.uri == subject.uri)
            {
              found = true;
              polygon.setMap((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));
            }
          }              
          
          if(!found)
          {
            /** Display polygons on the map */
            var polygonCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polygonCoordinates");
            
            // First check if there is a color defined for this specific record.
            // If there is none, then we check if there is one associated
            // with the type of the record.
            
            var color = "#CA2251";
            
            var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
            
            if(scoColor.length > 0)
            {
              color = scoColor[0];
            }
            else
            {            
              for(var s = 0; s < self.schemas.length; s++)
              {
                var polygonType = self.schemas[s].getType(subject.type);
                
                if(polygonType != null)
                {              
                  if(polygonType.color != null)
                  {
                    color = polygonType.color[0];
                  }
                }
              }            
            }
            
            var firstPosition = null;
            
            for(var pc = 0; pc < polygonCoordinates.length; pc++)   
            {
              var polygonCoordinate = polygonCoordinates[pc];
              
              var rawPoints = polygonCoordinate.split(" ");
              
              var polygonPoints = [];
              
              var polygonLatLngBounds = new google.maps.LatLngBounds();     
              
              for(var pt = 0; pt < rawPoints.length; pt++)   
              {
                var point = rawPoints[pt];
                
                var points = point.split(",");
                
                polygonPoints.push(new google.maps.LatLng(points[1], points[0]));
                
                polygonLatLngBounds = polygonLatLngBounds.extend(new google.maps.LatLng(points[1], points[0]));
                
                if(firstPosition == null)
                {
                  firstPosition = new google.maps.LatLng(points[1], points[0]);
                }
              }
                     
              
              var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.05
              });
              
              polygon.data = subject;
              polygon.bounds = polygonLatLngBounds;

              var boxText = document.createElement("div");
              boxText.style.cssText = "font-weight: bolder; border: 1px solid #3366CC; margin-top: 8px; background: #3366CC; padding: 3px; color: black;";                        
              boxText.innerHTML = subject.getPrefLabel();
                      
              var myOptions = { content: boxText,
                                disableAutoPan: true,
                                maxWidth: 0,
                                pixelOffset: new google.maps.Size(0, 10),
                                zIndex: null,
                                boxStyle: { 
                                  background: "",
                                  opacity: 0.90
                                },
                                closeBoxMargin: "10px 2px 2px 2px",
                                closeBoxURL: "",
                                infoBoxClearance: new google.maps.Size(1, 1),
                                isHidden: true,
                                pane: "floatPane",
                                enableEventPropagation: false};



              var ib = new InfoBox(myOptions);
              
              ib.open((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));
              
              polygon.infobox = ib;
              
              // Add a listener for displaying tooltips for the this.polygons
              google.maps.event.addListener(polygon, 'mouseout', function() {
                this.infobox.hide();
              });
              
              google.maps.event.addListener(polygon, 'mouseover', function() {
                this.infobox.show();
                self.featureOver(this.data.uri);
              });
              
              google.maps.event.addListener(polygon, 'mousemove', function(e) {
                this.infobox.setPosition(e.latLng);
              });              
              
              this.polygons.push(polygon);
              
              polygon.setMap((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));     
            }   
          }
        }
        
        /** Make sure this this.polylines is not already displayed on the map */
        if(!found)
        {
          for(var pl = 0; pl < this.polylines.length; pl++)   
          {
            var polyline = this.polylines[pl];
            if(polyline.data.uri == subject.uri)
            {
              found = true;
              polyline.setMap((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));
            }
          }              
          
          if(!found)
          {
            /** Display this.polygons on the map */
            var polylineCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polylineCoordinates");
            
            // First check if there is a color defined for this specific record.
            // If there is none, then we check if there is one associated
            // with the type of the record.
            
            var color = "#CA2251";
            
            var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
            
            if(scoColor.length > 0)
            {
              color = scoColor[0];
            }
            else
            {
              for(var s = 0; s < self.schemas.length; s++)
              {
                var polylineType = self.schemas[s].getType(subject.type);
                
                if(polylineType != null)
                {              
                  if(polylineType.color != null)
                  {
                    color = polylineType.color[0];
                  }
                }
              }            
            }
            
            for(var pc = 0; pc < polylineCoordinates.length; pc++)   
            {     
              var polylineCoordinate = polylineCoordinates[pc];
              
              var rawPoints = polylineCoordinate.split(" ");
              
              var polylinePoints = [];
              
              var polylineLatLngBounds = new google.maps.LatLngBounds();             
              
              for(var pt = 0; pt < rawPoints.length; pt++)
              {        
                var point = rawPoints[p];
                
                var points = point.split(",");
                
                polylinePoints.push(new google.maps.LatLng(points[1], points[0]));
              
                polylineLatLngBounds = polylineLatLngBounds.extend(new google.maps.LatLng(points[1], points[0]));
                
                if(firstPosition == null)
                {
                  firstPosition = new google.maps.LatLng(points[1], points[0]);
                }                  
              }
              
           
              var polyline = new google.maps.Polyline({
                path: polylinePoints,
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.05
              });
              
              polyline.data = subject;
              
              polyline.bounds = polylineLatLngBounds;

              var boxText = document.createElement("div");
              boxText.style.cssText = "font-weight: bolder; border: 1px solid #3366CC; margin-top: 8px; background: #3366CC; padding: 3px; color: black;";                        
              boxText.innerHTML = subject.getPrefLabel();
                      
              var myOptions = { content: boxText,
                                disableAutoPan: true,
                                maxWidth: 0,
                                pixelOffset: new google.maps.Size(0, 10),
                                zIndex: null,
                                boxStyle: { 
                                  background: "",
                                  opacity: 0.90
                                },
                                closeBoxMargin: "10px 2px 2px 2px",
                                closeBoxURL: "",
                                infoBoxClearance: new google.maps.Size(1, 1),
                                isHidden: true,
                                pane: "floatPane",
                                enableEventPropagation: false};


              var ib = new InfoBox(myOptions);
              
              ib.open((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));
              
              polyline.infobox = ib;
              
              // Add a listener for displaying tooltips for the this.polygons
              
              google.maps.event.addListener(polyline, 'mouseout', function() {
                this.infobox.hide();
              });
              
              google.maps.event.addListener(polyline, 'mouseover', function() {
                this.infobox.show();
                self.featureOver(this.data.uri);
              });
              
              google.maps.event.addListener(polygon, 'mousemove', function(e) {
                this.infobox.setPosition(e.latLng);
              });              
              
              this.polylines.push(polyline);
              
              polyline.setMap((this.selectedFocusMapID == -1 ? this.map : this.focusMaps[this.selectedFocusMapID].map));                
            }   
          }
        }      
      }    
    }

    this.renumberResults();
    this.displayResults();
    this.displayTaggedRecords(this.taggedResults);  
  }
                                    
  /**
  * Renumber the results in the resultset list. This is used when the list change avec a record got tagged/untagged
  */
  this.renumberResults = function renumberResults() {
    var counter = 1;
    for(var i = 0; i < 128; i++)
    {
      if ($("#result_column_left_"+i).length > 0)
      {
        $("#result_column_left_"+i).text(counter+'. ');
        counter++;
      }
    }
  }
        
  /**
  * Highlight a tagged result, within the resultset display
  * 
  * @param id ID of the HTML elements of the resultset canvas
  */
  this.highlightTaggedResult = function highlightTaggedResult(id) {
    $('#webMapResults').find('*').removeClass('result-highlight');
    
    for(var i = 0; i < this.taggedRecords.length; i++)
    {   
      if(i == id)
      {
        $('#tagged_result_' + i).addClass("result-highlight");
        return;
      }
    }
  }
                   
  /**
  * Highlight a result, within the resultset display
  * 
  * @param id ID of the HTML elements of the resultset canvas
  */                               
  this.highlightResult = function highlightResult(id) {
    $('#webMapResults').find('*').removeClass('result-highlight');
    
    for(var i = 0; i < this.results.length; i++)
    {   
      if(i == id)
      {
        $("#result_"+i).addClass("result-highlight");
        continue;
      }
      
      /* Add the result container */
      if(i % 2 == 0)
      {
        $("#result_"+i).addClass("result-even");
      }
      else
      {
        $("#result_"+i).addClass("result-odd");
      }  
    }
  }

  /**
  * Display the results pagination control
  * 
  * @param nbResults Number of results in the entire resulset
  * @param page Current page number displayed to the user
  */
  this.displayResultsPagination = function displayResultsPagination(nbResults, page) {
    if(nbResults <= this.mapResultsPerPage)
    {
      $("#resultsPaginator").hide();  
    }
    else
    {
      $("#resultsPaginator").show();  
      
      this.currentResultsetPage = page;
    }
    
    $("#resultsPaginator").pagination(nbResults, {
      items_per_page: this.mapResultsPerPage, 
      num_display_entries: 7,
      num_edge_entries: 1,
      current_page: page,
      callback: this.handlePaginationClick
    });  

    if($.cookie('webmap-resultsperpage') == null)
    {
      $.cookie('webmap-resultsperpage', 20, { expires: 365, path: "/" });
    }
    else
    {
      this.mapResultsPerPage = $.cookie('webmap-resultsperpage');
    }

    var comboHtml = '<select style="float:right; margin-right: 10px;">';

    if(this.mapResultsPerPage == 20)
    {
      comboHtml += '<option value="20" selected>20</option>';
    }
    else
    {
      comboHtml += '<option value="20">20</option>';
    }

    if(this.mapResultsPerPage == 50)
    {
      comboHtml += '<option value="50" selected>50</option>';
    }
    else
    {
      comboHtml += '<option value="50">50</option>';
    }

    if(this.mapResultsPerPage == 100)
    {
      comboHtml += '<option value="100" selected>100</option>';
    }
    else
    {
      comboHtml += '<option value="100">100</option>';
    }

    if(this.mapResultsPerPage == 200)
    {
      comboHtml += '<option value="200" selected>200</option>';
    }
    else
    {
      comboHtml += '<option value="200">200</option>';
    }

    comboHtml += '</select>';


    // Add nb this.results selector.
    $("#resultsPaginator").append(comboHtml); 
    
    $("#resultsPaginator > select").change(function() {
      self.changeResultsPerPage(this);
    });   
  }

  /**
  * Changes the number of results to display per page
  * 
  * @param obj a reference to the nb results selection control
  */
  this.changeResultsPerPage = function changeResultsPerPage(obj) {

    this.mapResultsPerPage = obj.value;
    
    $.cookie('webmap-resultsperpage', obj.value, { expires: 365, path: "/" });    
                
    this.dataRequestedByUser = true;
    this.forceAllFocusWindowsSearch = true;
    this.search();
  }

  /**
  * Triggered when a page is selected in the pagination control. This send a new query to the endpoint.
  * 
  * @param new_page_index The new page number
  * @param pagination_container A reference to the pagination control
  */
  this.handlePaginationClick = function handlePaginationClick(new_page_index, pagination_container) {
    if(this.current_page != new_page_index)
    {
      self.currentResultsetPage = new_page_index;
      
      self.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = false;
      self.search();
    }
    
    return false;
  }

  /**
  * Display the dataset filters available for the current map
  */
  this.displayFiltersDataset = function displayFiltersDataset() { 
    /* Delete all previously inserted item */
    $(".webMapFiltersTitleDataset").remove();
    $(".webMapFiltersDataset").remove();
    
    var inputValue = "";
    
    if($("#searchDatasetFilterForm").length > 0)
    {
      var inputValue = $("#quicksearchinput_filterdatasets").val();
      $("#searchDatasetFilterForm").remove();
    }
      
    if(this.filtersDatasets.length > 0)
    {
      $("#webMapFilters").append('<div id="webMapFiltersTitleDataset" class="webMapFiltersTitleDataset">'+this.labels.sourcesFilterSectionHeader+'</div>'); 
      
      this.displayHelpTipsHover("webMapFiltersTitleDataset", "Filter results by their provenance", "e");
      
      $("#webMapFilters").append('<form method="get" id="searchDatasetFilterForm">\
                                    <div style="padding-bottom: 5px;">\
                                      <img src="'+this.imagesFolder+'magnifier.png" style="position: relative; top: 4px; left: 3px"> <input type="text" value="" name="q" id="quicksearchinput_filterdatasets" style="margin-left: 4px" autocomplete="off" />\
                                    </div>\
                                  </form>');    

      this.displayHelpTipsHover("searchDatasetFilterForm", "Filter displayed sources", "e");
      
      $("#webMapFilters").append('<div id="webMapFiltersDataset" class="webMapFiltersDataset"></div>'); 
      
      for(var i = 0; i < this.filtersDatasets.length; i++)
      {
        $("#webMapFiltersDataset").append('<div id="filter_dataset_' + i + '" class="webMapFiltersDatasetItem"></div>');    
        
        this.displayHelpTipsHover('filter_dataset_' + i, "Only shows result in \"" + this.filtersDatasets[i].prefLabel + "\"", "e");
        
        if(this.checkedFiltersDatasets.indexOf(this.filtersDatasets[i].uri) != -1)
        {
          $("#filter_dataset_" + i).append('<label><input class="datasetCheckbox" type="checkbox" name="filter_dataset_checkbox_' + i + '" id="filter_dataset_checkbox_' + i + '" title="Only display results from that source" checked>' + this.filtersDatasets[i].prefLabel + (this.filtersDatasets[i].nbRecords == 0 ? "" : " (" + this.filtersDatasets[i].nbRecords + ")") + "</label>"); 
        }
        else
        {
          $("#filter_dataset_" + i).append('<label><input class="datasetCheckbox" type="checkbox" name="filter_dataset_checkbox_' + i + '" id="filter_dataset_checkbox_' + i + '" title="Only display results from that source">' + this.filtersDatasets[i].prefLabel + (this.filtersDatasets[i].nbRecords == 0 ? "" : " (" + this.filtersDatasets[i].nbRecords + ")") + "</label>"); 
        }

        $("#filter_dataset_checkbox_" + i).click(function() {
          self.datasetFilterCheck(this);
        });  
        
        $('#filter_dataset_' + i).mouseover(function() {
          $(this).css('font-weight', "bold");
        });
        
        $('#filter_dataset_' + i).mouseout(function() {
          $(this).css('font-weight', "normal");
        });
      }     
      
      $('#quicksearchinput_filterdatasets').quicksearch('div#webMapFiltersDataset div');  
      $("#quicksearchinput_filterdatasets").val(inputValue);   
      $("#quicksearchinput_filterdatasets").keyup();
    }
  }    

  /**
  * Check/uncheck a dataset filter
  * 
  * @param checkbox A reference to the checkbox HTML control object
  */  
  this.datasetFilterCheck = function datasetFilterCheck(checkbox) {
    
    this.dataRequestedByUser = true;
    
    $(".tipsy").remove();
    
    var index = checkbox.name.substring(checkbox.name.lastIndexOf("_") + 1);
    
    /** 
    * If we are in focus windows mode, we make sure that we re-initialize the focus map resultset
    * such that the filter get applied to the other focus maps if they get re-selected
    */
    if(this.enableFocusWindows)
    {
      this.focusMapsResults = {
        "1": null,
        "2": null,
        "3": null
      };        
    }      
    
    if(checkbox.checked) // This means that the checkbox has just been checked
    {
      this.checkedFiltersDatasets.push(this.filtersDatasets[index].uri)
      
      this.nbResults = 0;
      this.currentResultsetPage = 0; 
      
      this.session.fd = this.checkedFiltersDatasets;   
      
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }
    else // This means that the checkbox has just been un-checked
    {
      this.removeByElement(this.checkedFiltersDatasets, this.filtersDatasets[index].uri);
      
      if(this.checkedFiltersDatasets.length == 0)
      {
         this.session.fd = [];
      }
      
      this.nbResults = 0;
      this.currentResultsetPage = 0;  
      
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }
  }

  /**
  * Display the type filters available for the current map
  */  
  this.displayFiltersType = function displayFiltersType() {            
    /* Delete all previously inserted item */
    $(".webMapFiltersTitleType").remove();
    $(".webMapFiltersType").remove();

    var inputValue = "";
    
    if($("#searchTypeFilterForm").length > 0)
    {
      var inputValue = $("#quicksearchinput_filtertypes").val();
      $("#searchTypeFilterForm").remove();
    }  
    
    if(this.filtersTypes.length > 0)
    {
      $("#webMapFilters").append('<div id="webMapFiltersTitleType" class="webMapFiltersTitleType">'+this.labels.typesFilterSectionHeader+'</div>'); 
      
      this.displayHelpTipsHover("webMapFiltersTitleType", "Filter results by their kind", "e");
      
      $("#webMapFilters").append('<form method="get" id="searchTypeFilterForm">\
                                    <div style="padding-bottom: 5px;">\
                                      <img src="'+this.imagesFolder+'magnifier.png" style="position: relative; top: 4px; left: 3px"> <input type="text" value="" name="q" id="quicksearchinput_filtertypes" style="margin-left: 4px" autocomplete="off" />\
                                    </div>\
                                  </form>');       
                                  
      this.displayHelpTipsHover("searchTypeFilterForm", "Filter displayed kinds", "e");                                
      
      $("#webMapFilters").append('<div id="webMapFiltersType" class="webMapFiltersType"></div>'); 
      
      for(var i = 0; i < this.filtersTypes.length; i++)
      {
        // Make sure that it shouldn't be ignored by the sWebMap component.
        var ignore = false;
        for(var s = 0; s < this.schemas.length; s++)
        {
          var type = this.schemas[s].getType(this.filtersTypes[i].uri);
          
          if(type != null)
          {
            if(type.ignoredBy != undefined && type.ignoredBy[0] == "http://purl.org/ontology/sco#sWebMap")
            {
              ignore = true;
            }
            
            break;
          }
        }
        
        if(ignore)
        {
          continue;
        }
        
        $("#webMapFiltersType").append('<div id="filter_type_' + i + '" class="webMapFiltersTypeItem"></div>');
            
        this.displayHelpTipsHover('filter_type_' + i, "Only shows result of kind \"" + this.filtersTypes[i].prefLabel + "\"", "e");          
            
        if(this.filtersTypes[i].nbRecords > 0 || this.checkedFiltersTypes.indexOf(this.filtersTypes[i].uri) != -1)
        {
          if(this.checkedFiltersTypes.indexOf(this.filtersTypes[i].uri) != -1)
          {
            $("#filter_type_" + i).append('<label><input class="typeCheckbox" type="checkbox" name="filter_type_checkbox_' + i + '" id="filter_type_checkbox_' + i + '" title="Only display results of that kind" checked>' + this.filtersTypes[i].prefLabel + (this.filtersTypes[i].nbRecords == 0 || this.displayTypeFiltersCounts == false ? "" : " (" + this.filtersTypes[i].nbRecords + ")") + '</label>'); 
          }
          else
          {
            $("#filter_type_" + i).append('<label><input class="typeCheckbox" type="checkbox" name="filter_type_checkbox_' + i + '" id="filter_type_checkbox_' + i + '" title="Only display results of that kind">' + this.filtersTypes[i].prefLabel + (this.filtersTypes[i].nbRecords == 0 || this.displayTypeFiltersCounts == false ? "" : " (" + this.filtersTypes[i].nbRecords + ")") + '</label>'); 
          }
            
          $("#filter_type_checkbox_" + i).click(function() {
            self.typeFilterCheck(this);
          });              
          
          $('#filter_type_' + i).mouseover(function() {
            $(this).css('font-weight', "bold");
          })
          
          $('#filter_type_' + i).mouseout(function() {
            $(this).css('font-weight', "normal");
          })      
        }
      }
      
      $('#quicksearchinput_filtertypes').quicksearch('div#webMapFiltersType div');  
      $("#quicksearchinput_filtertypes").val(inputValue);   
      $("#quicksearchinput_filtertypes").keyup();
    }
  }

  /**
  * Check/uncheck a type filter
  * 
  * @param checkbox A reference to the checkbox HTML control object
  */  
  this.typeFilterCheck = function typeFilterCheck(checkbox) {
    
    this.dataRequestedByUser = true;
    
    $(".tipsy").remove();
    
    var index = checkbox.name.substring(checkbox.name.lastIndexOf("_") + 1);
    
    /** 
    * If we are in focus windows mode, we make sure that we re-initialize the focus map resultset
    * such that the filter get applied to the other focus maps if they get re-selected
    */
    if(this.enableFocusWindows)
    {
      this.focusMapsResults = {
        "1": null,
        "2": null,
        "3": null
      };        
    }      
    
    if(checkbox.checked) // This means that the checkbox has just been checked
    {
      this.checkedFiltersTypes.push(this.filtersTypes[index].uri)
      
      this.nbResults = 0;
      this.currentResultsetPage = 0; 
      
      this.session.ft = this.checkedFiltersTypes;   
    
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }
    else // This means that the checkbox has just been un-checked
    {
      this.removeByElement(this.checkedFiltersTypes, this.filtersTypes[index].uri);
      
      if(this.checkedFiltersTypes.length == 0)
      {
         this.session.ft = [];
      }
      
      this.nbResults = 0;
      this.currentResultsetPage = 0;    
      
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }  
  }

  /**
  * Display the type attribute available for the current map
  */  
  this.displayFiltersAttribute = function displayFiltersAttribute() {
    /* Delete all previously inserted item */
    $(".webMapFiltersTitleAttribute").remove();
    $(".webMapFiltersAttribute").remove();
    $(".webMapFiltersInputContainer").remove();
      
    if($("#searchAttributeFilterForm").length > 0)
    {
      var inputValue = $("#quicksearchinput_filterattributes").val();
      $("#searchAttributeFilterForm").remove();
    }    
      
    if(this.filtersAttributes.length > 0)
    {
      $("#webMapFilters").append('<div id="webMapFiltersTitleAttribute" class="webMapFiltersTitleAttribute">'+this.labels.attributesFilterSectionHeader+'</div>'); 
          
      this.displayHelpTipsHover("webMapFiltersTitleAttribute", "Filter results by their attributes", "e");        
          
      $("#webMapFilters").append('<div id="webMapFiltersInputContainer" class="webMapFiltersInputContainer"></div>'); 
      
      $("#webMapFilters").append('<form method="get" id="searchAttributeFilterForm">\
                                    <div style="padding-bottom: 5px;">\
                                      <img src="'+this.imagesFolder+'magnifier.png" style="position: relative; top: 4px; left: 3px"> <input type="text" value="" name="q" id="quicksearchinput_filterattributes" style="margin-left: 4px" autocomplete="off" />\
                                    </div>\
                                  </form>');     
                                  
      this.displayHelpTipsHover("searchAttributeFilterForm", "Filter displayed attributes", "e");                                
      
      $("#webMapFilters").append('<div id="webMapFiltersAttribute" class="webMapFiltersAttribute"></div>'); 
      
      for(var i = 0; i < this.filtersAttributes.length; i++)
      {
        // Make sure that it shouldn't be ignored by the sWebMap component.
        var ignore = false;
        for(var s = 0; s < this.schemas.length; s++)
        {
          var attribute = this.schemas[s].getAttribute(this.filtersAttributes[i].uri);
          
          if(attribute != null)
          {
            if(attribute.ignoredBy != undefined && attribute.ignoredBy[0] == "http://purl.org/ontology/sco#sWebMap")
            {
              ignore = true;
            }
            
            break;
          }
        }
        
        if(ignore)
        {
          continue;
        }      
        
        if(this.filtersAttributes[i].nbRecords > 0 || this.checkedFiltersAttributes.indexOf(this.filtersAttributes[i].uri) != -1)
        {
          $("#webMapFiltersAttribute").append('<div id="filter_attribute_' + i + '" class="webMapFiltersAttributeItem"></div>');    

          
          if(this.attributeValueFilters[this.filtersAttributes[i].uri] == undefined)
          {
            $("#filter_attribute_" + i).append('<img id="attributeFilterImage_'+i+'" class="attributeFilterImage" src="'+this.imagesFolder+'magnifier_zoom_in.png" title="Add a value to filter by" />');
            this.displayHelpTipsHover('filter_attribute_' + i, "Shows results that have a certain value for the \"" + this.filtersAttributes[i].prefLabel + "\" attribute", "e");
            
            $("#attributeFilterImage_" + i).click(function() {
              var id = this.id.substring(this.id.lastIndexOf("_") + 1);
              self.addFilterValue(id);
            });             
          }
          else
          {
            $("#filter_attribute_" + i).append('<img id="attributeFilterImage_'+i+'" class="attributeFilterImage" src="'+this.imagesFolder+'magifier_zoom_out.png" title="Remove the value filter for that attribute" />');
            this.displayHelpTipsHover('filter_attribute_' + i, "Remove this attribute/value filter", "e");
            
            $("#attributeFilterImage_" + i).click(function() {
              var id = this.id.substring(this.id.lastIndexOf("_") + 1);
              self.removeAttributeValueFilter(id);
            });             
          }

 
           
          if(this.checkedFiltersAttributes.indexOf(this.filtersAttributes[i].uri) != -1)
          {
            $("#filter_attribute_" + i).append('<span id="attributeFilterCheckboxText_'+i+'">' + this.filtersAttributes[i].prefLabel + " = <b>" + this.attributeValueFilters[this.filtersAttributes[i].uri] + "</b> " + (this.filtersAttributes[i].nbRecords == 0 || this.displayAttributeFiltersCounts == false ? "" : " (" + this.filtersAttributes[i].nbRecords + ")") +'</span>'); 
          }
          else
          {
            $("#filter_attribute_" + i).append('<span id="attributeFilterCheckboxText_'+i+'">' + this.filtersAttributes[i].prefLabel + (this.filtersAttributes[i].nbRecords == 0 || this.displayAttributeFiltersCounts == false ? "" : " (" + this.filtersAttributes[i].nbRecords + ")") + '</span>'); 
          }
          
          $('#attributeFilterCheckboxText_' + i).mouseover(function() {
            $(this).css('font-weight', "bold");
          })
          
          $('#attributeFilterCheckboxText_' + i).mouseout(function() {
            $(this).css('font-weight', "normal");
          })
          
          $("#attributeFilterCheckboxText_" + i).data("i", i);
          
          $("#attributeFilterCheckboxText_" + i).click(function() { 
          
            var i = $(this).data("i");
            
            if(this.attributeValueFilters[this.filtersAttributes[i].uri] == undefined)
            {
              this.addFilterValue(i);
            }
            else
            {
              this.removeAttributeValueFilter(i);
            }          
          });        
        }
      }
                   
      $('#quicksearchinput_filterattributes').quicksearch('div#webMapFiltersAttribute div');  
      $("#quicksearchinput_filterattributes").val(inputValue);   
      $("#quicksearchinput_filterattributes").keyup();
    }
  }

  /**
  * Display search/browse/sessions controls
  */
  this.displaySearch = function displaySearch() {
    
    var searchPluginsHTML = "";
    
    if(this.searchPlugins.length > 1)
    {
      searchPluginsHTML = '<select id="searchPluginsSelect">';
      
      for(var i = 0; i < this.searchPlugins.length; i++)
      {
        searchPluginsHTML += '<option value="'+i+'" '+(i == 0 ? "selected" : "")+' >'+this.searchPlugins[i].name+'</option>';
      }
      
      searchPluginsHTML += '</select>';
    }
    
    $("#webMapSearch").append('<table width="100%">\
      <tr>\
        <td width="100%"><div class="searchMapWrapper"><div class="inputMapWrapper"><input type="text" maxlength="2048" id="searchInput" class="searchBox" value="Search Map" style="font-style: italic" /></div></div></td>\
        <td width="0%"><div class="searchButtonMapWrapper"><input type="submit" class="searchButton" value=""></div></td>\
        <td width="0%"><div class="searchSelectionMapWrapper">'+(this.searchPlugins.length > 1 ? searchPluginsHTML : "")+'</div></td>\
      </tr>\
    </table>');
    
    $('#searchPluginsSelect').change(function(){
      
      self.dataRequestedByUser = false;
      self.displayFiltersByDefault = true;
      
      // Re-initialize a few structures when the user select a new search plugin.
      /** The set of dataset filters */
      self.filtersDatasets = [];

      /** The set of type filters */
      self.filtersTypes = [];

      /** The set of attribute filters */
      self.filtersAttributes = [];

      /** The list of dataset filters that have been checked (selected) by the user */
      self.checkedFiltersDatasets = [];

      /** The list of type filters that have been checked (selected) by the user */
      self.checkedFiltersTypes = [];

      /** The list of attribute filters that have been checked (selected) by the user */
      self.checkedFiltersAttributes = [];

      /** The set of attribute/value filters that have been defined by the user */
      self.attributeValueFilters = {};
      
      $('.searchBox').val(self.labels.searchInput);

      self.session = {
        name: "",   // The name of the session
        notes: "",  // Some notes to display to the user about the session
        q: "",      // The search query
        fd: [],     // The dataset filters (dataset URIs to include in the resultset)
        fa: [],     // The attribute filters (attribute URIs to include in the resultset)
        ft: [],     // The type filters (type URIS to include in the resultset)
        av: {},     // The attribute/value filters (URI + value to include in the resultset)
        attributes_boolean_operator: "and", // The boolean operator to use when multiple attribute/value filters are defined.
        records: [] // The pre-selected (tagged) records to persist on the map
      };  
      
      $("#resultsPaginator").hide();
      
      if(self.enableFocusWindows)
      {      
        self.forceAllFocusWindowsSearch = true;
      }
      
      self.search();
    });
    
    $('.searchBox').val(this.labels.searchInput);
    $('.searchButton').val(this.labels.searchButton);
    
    $('.searchButton').click(function() {
      self.dataRequestedByUser = true;
      self.forceAllFocusWindowsSearch = true;
      self.search();
    });
    
    $('#searchInput').focus(function(){
      if($(this).val() == self.labels.searchInput)
      {
        $(this).val("");
        $(this).css('font-style', 'normal');
      }
    });
    
    $('#searchInput').blur(function(){
      if($(this).val() == "")
      {
        $(this).val(self.labels.searchInput);
        $(this).css('font-style', 'italic');
      }
    });    
    
    $("#searchInput").keypress(function(event) {
      return self.submitSearchEnter(this, event);
    });  

    $('#searchInput').tipsy({fade: true, gravity: 's', title: function() { return("Search for something specific"); }});
    
    if(this.enableSessions)
    {    
      var sessions = this.getSessions();
    
      if(sessions.length <= 0)
      {
        //$('#mapsList').hide();
        $('#selectMapDiv').hide();
      }
      else
      {
        $('#selectMapDiv').show();
      }
    }
  }

  /**
  * Clear the map: remove all the non-tagged records from the map, and the resultset.
  */
  this.clearMap = function clearMap() { 
    
    this.hideUntaggedRecords();  
    
    this.displayResultsPagination(0, 0);
    
    this.results = [];
    
    this.displayResults();

    if(!this.displayFiltersByDefault)
    {
      this.checkedFiltersDatasets = [];
      this.checkedFiltersTypes = [];
      this.checkedFiltersAttributes = [];
      
      this.filtersAttributes = [];
      this.filtersTypes = [];
      this.filtersDatasets = [];
      
      this.attributeValueFilters = {};
    }
    
    this.displayFiltersDataset();    
    this.displayFiltersType();
    this.displayFiltersAttribute();
  }

  /**
  * Load a map session
  * 
  * @param obj Reference to the map list control used to select a map to load
  */
  this.loadMap = function loadMap(obj) {
    this.startWaiting();
    
    this.mapLoading = true;
    
    $("#searchInput").val(this.labels.searchInput);
    
    if(this.googleUrlShortenerKey != "" && this.sharedMapUrl != "")
    {
      $("#linkButtonDiv").hide();
    }
    
    $("#deleteButtonDiv").hide();

    if(!$("#importBox").is(':hidden'))
    {
      $('#mapSessionsPanel').fadeOut('slow', function() {});    
    }
    
    this.taggedRecords = [];
    this.taggedResults = [];
    
    $('#taggedRecordsBox').empty();
    
    this.clearMap();  
    
    var ses;
        
    if(obj.notes == undefined)
    {
      obj = $(obj).children(":first").get(0);
      
      if(obj.selectedIndex != 0)
      {
        this.selectedMapId = obj.value;
        
        var sessions = this.getSessions();
        ses = sessions[parseInt(obj.value)];
      }
    }
    else
    {
      ses = obj;
    }
    
    if(ses.fwe == undefined)
    {
      ses.fwe = false;
    }
    
    // Check if the session require the focus windows or not. If the same kind of sWebMap
    // is currently loaded than what is needed by the session, we reload the page by
    // running the proper one.
    if(ses.fwe != this.enableFocusWindows)
    {
      if(window.location.toString().indexOf('?') == -1)
      {                                             
        window.location = window.location.toString() + '?map=' + escape(JSON.stringify(ses));
      }
      else
      {
        if(window.location.toString().indexOf('map=') == -1)
        {
          window.location = window.location.toString() + '&map=' + escape(JSON.stringify(ses));
        }
        else
        {
          var mapPos = window.location.toString().indexOf('map=');
          var endPos = window.location.toString().indexOf('&', mapPos + 1);
          
          var url = "";
          
          if(endPos == -1)
          {
            // the map parameter is at the end of the URL
            url = window.location.toString().substring(0, mapPos);
          }
          else
          {
            // the map parameter is not at the end of the URL; it is somewhere in the middle
            url = window.location.toString().substring(0, mapPos) + window.location.toString().substring(endPos);
          }
          
          window.location = url + 'map=' + escape(JSON.stringify(ses));
        }
      }
    }
      
    if(this.googleUrlShortenerKey != "" && this.sharedMapUrl != "")
    {
      $("#linkButtonDiv").show();
    }
    
    $("#deleteButtonDiv").show();
    
    // Force resize to refresh the this.map and display the link and delete buttons that we shown above.
    google.maps.event.trigger(this.map, 'resize');
    this.map.setZoom(this.map.getZoom());
    
    
    this.checkedFiltersDatasets = ses.fd;
    this.checkedFiltersTypes = ses.ft;
    this.checkedFiltersAttributes = ses.fa;
    this.attributeValueFilters = ses.av;
    
    $("#searchInput").val(ses.q);
    
    this.session = ses;
    
    if(ses.notes != "")
    {
      $('#mapSessionsMessagePanel').empty();    
      
      $('#mapSessionsMessagePanel').append('<table style="margin: 20px;"><tbody style="border: none;"><tr><td><h2 style="margin: 0px;">Notes:</h2><br />'+this.session.notes+'</td></tr></tbody></table>');
      
      $('#mapSessionsMessagePanel').fadeIn('slow', function() {});          
    }
    
    // Tag all the previously tagged records.
    if(ses.fwe)
    {
      // Properly position the focus windows
      // Set the proper zoom level for the focus windows
      var f1LatLngBounds = new google.maps.LatLngBounds();
                      
      f1LatLngBounds = f1LatLngBounds.extend(new google.maps.LatLng(ses.f1.nelat, ses.f1.nelng));
      f1LatLngBounds = f1LatLngBounds.extend(new google.maps.LatLng(ses.f1.swlat, ses.f1.swlng));
      
      this.focusMaps[0].map.fitBounds(f1LatLngBounds);
      this.focusMaps[0].map.setZoom(ses.f1.z);

      var f2LatLngBounds = new google.maps.LatLngBounds();

      f2LatLngBounds = f2LatLngBounds.extend(new google.maps.LatLng(ses.f2.nelat, ses.f2.nelng));
      f2LatLngBounds = f2LatLngBounds.extend(new google.maps.LatLng(ses.f2.swlat, ses.f2.swlng));
      
      this.focusMaps[1].map.fitBounds(f2LatLngBounds);
      this.focusMaps[0].map.setZoom(ses.f2.z);

      var f3LatLngBounds = new google.maps.LatLngBounds();

      f3LatLngBounds = f3LatLngBounds.extend(new google.maps.LatLng(ses.f3.nelat, ses.f3.nelng));
      f3LatLngBounds = f3LatLngBounds.extend(new google.maps.LatLng(ses.f3.swlat, ses.f3.swlng));
      
      this.focusMaps[2].map.fitBounds(f3LatLngBounds);
      this.focusMaps[0].map.setZoom(ses.f3.z);
      
      // Tag records within each focus window
      if(ses.f1.r.length > 0)
      {
        google.maps.event.trigger(this.focusMaps[0].map, 'click');
        
        for(var i = 0; i < ses.f1.r.length; i++)
        {          
          this.tagRecord({}, ses.f1.r[i]);
        }
        
        this.clearMap();
      }
      
      if(ses.f2.r.length > 0)
      {
        google.maps.event.trigger(this.focusMaps[1].map, 'click');
        
        for(var i = 0; i < ses.f2.r.length; i++)
        {          
          this.tagRecord({}, ses.f2.r[i]);
        }

        this.clearMap();          
      }

      if(ses.f3.r.length > 0)
      {
        google.maps.event.trigger(this.focusMaps[2].map, 'click');
        
        for(var i = 0; i < ses.f3.r.length; i++)
        {          
          this.tagRecord({}, ses.f3.r[i]);
        }

        this.clearMap();          
      }        
      
      // Select the proper focus window
      google.maps.event.trigger(this.focusMaps[ses.sfw - 1].map, 'click');
      this.selectedFocusMapID = ses.sfw;        
      
      this.clearMap();          
    }
    else
    {
      for(var i = 0; i < ses.records.length; i++)
      {
        this.tagRecord({}, ses.records[i]);  
      }
    }
      
    // If there are tagged records, we are not automatically running the search.
    // This indicate us that the user want to shows particular tagged records
    var isTaggedRecords = false;
    
    if(ses.fwe)
    {
      if(ses.f1.r.length > 0 || 
         ses.f2.r.length > 0 ||
         ses.f3.r.length > 0)
      {
        isTaggedRecords = true;
      }
    }
    else
    {
      if(ses.records.length > 0)
      {
        isTaggedRecords = true;
      }
    }
    
    if(!isTaggedRecords)
    {
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }
    else
    {
      if(this.forceSearch)
      {
        this.dataRequestedByUser = true;
        this.forceAllFocusWindowsSearch = true;
        this.search();
      }

      this.zoomToTaggedRecords();
    }                          
    
    this.mapLoading = false;
    
    this.stopWaiting();
  }

  /** 
  * Initialize the sWebMap
  * 
  * @param session Session object to use to initialize the sWebMap
  */
  
  this.initializeMap = function initializeMap() {
    
    this.session = this.initializationSession;
    
    if(this.session.sfw != undefined)
    {
      this.selectedFocusMapID = this.session.sfw;
    }
    
    this.checkedFiltersDatasets = this.initializationSession.fd;
    this.checkedFiltersTypes = this.initializationSession.ft;
    
    // Tag all records
    for(var i = 0; i < this.initializationSession.records.length; i++)
    {
      this.tagRecord({}, this.initializationSession.records[i]);  
    }
    
    if(this.initializationSession.records.length <= 0)
    {
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }   
    else
    {      
      if(this.inclusionRecords.length > 0)
      {
        $("#inclusionButtonDiv").show();
        
        this.zoomToTaggedRecords();
      }
      
      if(this.forceSearch)
      {
        this.dataRequestedByUser = true;
        this.forceAllFocusWindowsSearch = true;
        this.search();
      }          
      else
      {
        if(this.displayFiltersByDefault)
        {
          this.forceAllFocusWindowsSearch = true;
          this.search();
        }
      }
    } 
  }

  /**
  * Delete the current map session
  */
  this.deleteMap = function deleteMap() {
    var sessions = this.getSessions();

    sessions.splice(this.selectedMapId, 1);  
    
    // Delete all sessions cookirs
    for(var i = 0; i < 256; i++)
    {
      if($.cookie('webmap-session-'+i) != null)
      {
        $.cookie('webmap-session-'+i, null);
      }
    }  
    
    // re-create the this.session cookies with the proper IDs.
    for(i = 0; i < sessions.length; i++)
    {
      $.cookie('webmap-session-'+i, JSON.stringify(sessions[i]), { expires: 365, path: "/" });
    }  
    
    // reload the available sessions combobox
    this.refreshMapSessionsList();
  }

  /** 
  * Refresh the content of the map sessions selection list control
  */
  this.refreshMapSessionsList = function refreshMapSessionsList() {
    
    if(this.googleUrlShortenerKey != "" && this.sharedMapUrl != "")
    {
      $("#linkButtonDiv").hide();
    }
    
    $("#deleteButtonDiv").hide();
    
    // reload the available sessions combobox
    $('#mapsList').empty();
    $('#mapsList').append(this.getMapsListBoxOptions());  
    
    var sessions = this.getSessions();
    
    if(sessions.length <= 0)
    {
      $('#selectMapDiv').hide();
    }
    else
    {
      $('#selectMapDiv').show();
    }
  }

  /**
  * The the list box options in HTML (used by refreshMapSessionsList())
  */
  this.getMapsListBoxOptions = function getMapsListBoxOptions() {
    var sessions = this.getSessions();
    
    var options = '<option value="0" selected>'+this.labels.loadSavedMapSessionInput+'</option>';
    
    if(sessions.length > 0)
    {
      for(i = 0; i < sessions.length; i++)
      {
        options += '<option value="'+i+'">'+sessions[i].name+'</option>';
      }
    }
    
    return(options);  
  }

  /**
  * Get the list of sessions that have been saved on this browser
  */
  this.getSessions = function getSessions() {
    var sessions = [];
    
    for(var i = 0; i < 256; i++)
    {
      if($.cookie('webmap-session-'+i) == null)
      {
        break;
      }
      else
      {
        sessions.push(JSON.parse($.cookie('webmap-session-'+i)));
      }
    }
    
    return(sessions);  
  }

  /**
  * Display the panel to save a new session
  */
  this.saveMapPanel = function saveMapPanel() {
    if($("#mapSessionsPanel").is(':hidden'))
    {
      $('#mapSessionsPanel').fadeIn('slow', function() {
        $("#mapSessionsPanel").empty();
        
        $("#mapSessionsPanel").append('<table style="padding-top: 20px;"><tbody style="border: none;"><tr><td style="padding-left: 20px;">session name:</td><td style="padding-right: 15px;"><input style="width: 100%" type="text" id="saveNameInput" /></td></tr><tr><td style="padding-left: 20px;">Notes:</td><td style="padding-right: 15px;"><textarea style="width: 100%" id="saveNotesInput" /></td></tr><tr><td colspan="2" align="center" style="padding-right: 15px;"><button id="saveSessionButton">Save session</button></td></tr></tbody></table>');
        
        $("#saveSessionButton").click(function() {
          self.saveMap();
        });         
      });
    }
    else
    {
      $('#mapSessionsPanel').fadeOut('slow', function() {
        
      });
    }
  }

  /**
  * Display the panel to share the current map session
  */
  this.linkMapPanel = function linkMapPanel() {
    if($("#mapSessionsPanel").is(':hidden'))
    {
      $('#mapSessionsPanel').fadeIn('slow', function() {
        $("#mapSessionsPanel").empty();
        
        var sessions = self.getSessions();
        
        var url = self.sharedMapUrl;
        
        url += "?map=" + escape(JSON.stringify(sessions[self.selectedMapId]));
        
        gapi.client.setApiKey(self.googleUrlShortenerKey);

        gapi.client.load('urlshortener', 'v1', function() {
            var request = gapi.client.urlshortener.url.insert({
                'resource': {
                    'longUrl': url
                }
            });
            var resp = request.execute(function(resp) {
                if (resp.error) {
                  $("#mapSessionsPanel").append('<table style="margin-top: 20px; margin-bottom: 20px;"><tbody style="border: none"><tr><td align="center">URL to this map session page: <input size="60" type="text" id="linkInput" value="Error: ' + resp.error.message + '" /></td></tr></tbody></table>');                  
                } else {
                  $("#mapSessionsPanel").append('<table style="margin-top: 20px; margin-bottom: 20px;"><tbody style="border: none"><tr><td align="center">URL to this map session page: <input size="60" type="text" id="linkInput" value="'+resp.id+'" /></td></tr></tbody></table>');
                  
                  $("#linkInput").focus(function() {
                     this.select();
                   });      
                }
            });
        });
      });
    }
    else
    {
      $('#mapSessionsPanel').fadeOut('slow', function() {
        
      });
    }
  }

  /**
  * Get the domain name of the current website
  */
  this.get_hostname = function get_hostname(url) {
      var m = ((url||'')+'').match(/^http:\/\/[^/]+/);
      return m ? m[0] : null;
  }

  /**
  * Save the current status of the map in a new session (that can eventually be reloaded or shared with others)
  * The session is saved within the browser.
  */
  this.saveMap = function saveMap() {
    
    if(!this.enableFocusWindows)
    {
      this.session = {
        name: $('#saveNameInput').val(),
        notes: $('#saveNotesInput').val(),
        q: ($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val()),
        fd: this.checkedFiltersDatasets,
        fa: this.checkedFiltersAttributes,
        ft: this.checkedFiltersTypes,
        av: this.attributeValueFilters,
        attributes_boolean_operator: "and",
        records: this.taggedRecords
      };
    }
    else
    {
      this.session = {
        name: $('#saveNameInput').val(),
        notes: $('#saveNotesInput').val(),
        q: ($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val()),
        fd: this.checkedFiltersDatasets,
        fa: this.checkedFiltersAttributes,
        ft: this.checkedFiltersTypes,
        av: this.attributeValueFilters,
        attributes_boolean_operator: "and",
        fwe: true, // Focus Window Enabled
        sfw: this.selectedFocusMapID, // Selected Focus Window
        f1: {
          nelat: this.focusMaps[0].map.getBounds().getNorthEast().lat(),
          nelng: this.focusMaps[0].map.getBounds().getNorthEast().lng(),
          swlat: this.focusMaps[0].map.getBounds().getSouthWest().lat(),
          swlng: this.focusMaps[0].map.getBounds().getSouthWest().lng(),
          z: this.focusMaps[0].map.getZoom(), // zoom
          r: this.focusMapsTaggedRecords[1] // records
        },
        f2: {
          nelat: this.focusMaps[1].map.getBounds().getNorthEast().lat(),
          nelng: this.focusMaps[1].map.getBounds().getNorthEast().lng(),
          swlat: this.focusMaps[1].map.getBounds().getSouthWest().lat(),
          swlng: this.focusMaps[1].map.getBounds().getSouthWest().lng(),
          z: this.focusMaps[1].map.getZoom(),
          r: this.focusMapsTaggedRecords[2]
        },
        f3: {
          nelat: this.focusMaps[2].map.getBounds().getNorthEast().lat(),
          nelng: this.focusMaps[2].map.getBounds().getNorthEast().lng(),
          swlat: this.focusMaps[2].map.getBounds().getSouthWest().lat(),
          swlng: this.focusMaps[2].map.getBounds().getSouthWest().lng(),
          z: this.focusMaps[2].map.getZoom(),
          r: this.focusMapsTaggedRecords[3]
        }
      };
    }
    
    $('#mapSessionsPanel').fadeOut('slow', function() {
      $('#saveNameInput').val("");
    });  
   
    for(var i = 0; i < 256; i++)
    {
      if($.cookie('webmap-session-'+i) == null)
      {
        break;
      }
    }   
    
    $.cookie('webmap-session-'+i, JSON.stringify(this.session), { expires: 365, path: "/" });
    
    alert("Session Saved");
    
    this.refreshMapSessionsList();
  }

  /**
  * Triggered when a key is pressed in the search field
  * 
  * @param field Reference to the search field
  * @param e Event that triggered the function
  */
  this.submitSearchEnter = function submitSearchEnter(field, e) {
    var keycode;
    
    if(window.event) 
    {
      keycode = window.event.keyCode; 
    }
    else if(e)
    {
      keycode = e.which; 
    }
    else 
    {
      return true; 
    }

    if (keycode == 13)
    {
      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();

      return false;
    }
    else
    {
      return true;
    }
  }

  /**
  * Browse for all records
  */
  this.browse = function browse() {
    $("#searchInput").val(this.labels.searchInput);
    
    this.dataRequestedByUser = true;
    this.forceAllFocusWindowsSearch = true;
    this.search();
  }

  /**
  * Remove an element in an array
  * 
  * @param arrayName Array where the element that has to be removed is
  * @param arrayElement Element to remove
  */
  this.removeByElement = function removeByElement(arrayName,arrayElement) {
    for(var i=0; i<arrayName.length;i++ )
    { 
      if(arrayName[i]==arrayElement)
      {
        arrayName.splice(i,1); 
      } 
    }
  }

  /**
  * Add an attribute/value filter
  * 
  * @param id ID of the attribute/filter control
  */
  this.addFilterValue = function addFilterValue(id) {
    
    /** 
    * If we are in focus windows mode, we make sure that we re-initialize the focus map resultset
    * such that the filter get applied to the other focus maps if they get re-selected
    */
    if(this.enableFocusWindows)
    {
      this.focusMapsResults = {
        "1": null,
        "2": null,
        "3": null
      };        
    }      
        
    if(this.attributeValueFilters[this.filtersAttributes[id].uri] == undefined)
    {
      this.attributeValueFilters[this.filtersAttributes[id].uri] = "";
    }
    
    $("#attributeFilterImage_"+id).attr("src", this.imagesFolder+"magnifier.png");
    $("#attributeFilterImage_"+id).attr("title", "Add the value to filter in the input text above");

    $("#attributeFilterCheckboxText_"+id).hide();
    $("#attributeFilterCheckboxText_"+id).after(('<table class="attributeFilterInputTable" id="attributeFilterInputTable_'+id+'"><tr><td>Filter:</td> <td><input class="webMapFiltersInputText" type="text" value="'+this.attributeValueFilters[this.filtersAttributes[id].uri]+'" id="webMapFiltersInputText_'+id+'" /></td><td><span id="addButton_'+id+'"></span></td></tr></table>'));
    
    $("#webMapFiltersInputText_" + id).keypress(function(event) {
      return self.submitFilterEnter(this, event);
    });   
    
    $('#attributeFilterInputTable_'+id).width($('#filter_attribute_'+id).width() - 30);   
    
    // Add the auto-completion behavior to the filter box

    var acDatasets = "";
    
    for(var i = 0; i < this.filtersDatasets.length; i++)
    {
      if(this.checkedFiltersDatasets.length > 0)
      {
        if(this.checkedFiltersDatasets.indexOf(this.filtersDatasets[i].uri) != -1)
        {
          acDatasets = this.filtersDatasets[i].uri+";";
        }  
      }
      else
      {
        acDatasets += this.filtersDatasets[i].uri+";";
      }
    } 

    // rtrim() to remove the last ";" char
    acDatasets.replace(/;+$/,"")   
    
    var acTypes = "";
    
    for(var i = 0; i < this.checkedFiltersTypes.length; i++)
    {
      acTypes = this.checkedFiltersTypes[i]+";";
    } 
    
    if(acTypes == "")
    {
      acTypes = "all";
    }
    else
    {
      // rtrim() to remove the last ";" char
      acTypes.replace(/;+$/,"") 
    }
    
    
    attributeValueFiltersWSString = "";
    
    for(var u in this.attributeValueFilters)
    {
      if(u != this.filtersAttributes[id].uri)
      {
        attributeValueFiltersWSString +=  this.urlencode(u) + "::" + this.urlencode(this.attributeValueFilters[u]) + ";";
      }
    }
    
    /** Possibly contraining this.results to target neighbourhoods */
    if(this.includeResultsInTargetInclusionRecords)
    {
      for(var tn = 0; tn < this.inclusionRecords.length; tn++)
      {
        attributeValueFiltersWSString = attributeValueFiltersWSString + this.urlencode("http://www.geonames.org/ontology#locatedIn") + "::" + this.urlencode(this.inclusionRecords[tn]) + ";";  
      }
      
      if(this.inclusionRecords.length > 1)
      {
        this.session.attributes_boolean_operator = "or";
      }
      else
      {
        this.session.attributes_boolean_operator = "and";
      }
    }  
    
    /** Get the coordinates of the squares of the current view this.map */
    var bounds, topRight, bottomLeft = 0; 
    
    if(this.enableFocusWindows)
    {
      var bounds = this.focusMaps[this.selectedFocusMapID - 1].map.getBounds();
      var topRight = bounds.getNorthEast();
      var bottomLeft = bounds.getSouthWest();       
    }
    else
    {
      var bounds = this.map.getBounds();
      var topRight = bounds.getNorthEast();
      var bottomLeft = bounds.getSouthWest(); 
    }
    
    filterAc = $("#webMapFiltersInputText_"+id).autocomplete({ 
      serviceUrl: this.structWSFAddress + "search/",
      sWebMapRef: self,
      minChars:0, 
      maxHeight:400,
      width:300,
      iconID: "searchButtonImage",
      zIndex: 9999,
      onSelect: function(value, data){            
        $("#webMapFiltersInputText_"+id).val(value.substring(0, value.lastIndexOf(" (")));
      },
      deferRequestBy: 0, //miliseconds
      params: { q: ($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val()),
                datasets: acDatasets,
                attributes: this.urlencode(this.filtersAttributes[id].uri),
                constrainedAttributes: attributeValueFiltersWSString,
                page: 0,
                items: 0,
                include_aggregates: "true",
                inference: "off",
                attributes_boolean_operator: this.session.attributes_boolean_operator,
                aggregate_attributes: this.urlencode(this.filtersAttributes[id].uri),
                types: acTypes,
                range_filter: topRight.lat()+";"+topRight.lng()+";"+bottomLeft.lat()+";"+bottomLeft.lng(),
                filterID: id
      },
      noCache: false //default is false, set to true to disable caching    
    });   
    
    filterAc.enable();  

    $("#webMapFiltersInputText_"+id).focus();
  }

  this.attributeValueFilter = function attributeValueFilter(id) {
    
    this.dataRequestedByUser = true;
    
    $(".tipsy").remove();
    
    var filteringValue = $("#webMapFiltersInputText_"+id).val();
    
    if(filteringValue == "")
    {
      $("#attributeFilterInputTable_"+id).remove();
      $("#attributeFilterImage_"+id).attr("src", this.imagesFolder+"magnifier_zoom_in.png"); 
      $("#attributeFilterImage_"+id).attr("title", "Add a value to filter by");      
      $("#attributeFilterCheckboxText_"+id).show();
      
      delete this.attributeValueFilters[this.filtersAttributes[id].uri];
    }
    else
    {
      $("#attributeFilterInputTable_"+id).remove();
      $("#attributeFilterCheckboxText_"+id).show();
      $("#attributeFilterImage_"+id).attr("src", this.imagesFolder+"magifier_zoom_out.png"); 
      $("#attributeFilterImage_"+id).attr("title", "Remove the value filter for that attribute");    

      this.attributeValueFilters[this.filtersAttributes[id].uri] = filteringValue;
      
      this.checkedFiltersAttributes.push(this.filtersAttributes[id].uri);
      
      // Update the label of the checkbox
      var label = $("#attributeFilterCheckboxText_"+id).html();
      var nbItems = label.substring(label.lastIndexOf("(") + 1, label.lastIndexOf(")"));
      
      if(label.lastIndexOf("=") == -1)
      {
        label = label.substring(0, label.lastIndexOf("(") - 1);
      }
      
      $("#attributeFilterCheckboxText_"+id).html(label + " = " + filteringValue + (this.displayAttributeFiltersCounts == false ? "" : " (" + nbItems + ")"));
      
      this.session.fa = this.filtersAttributes;
      this.session.av = this.attributeValueFilters;

      this.dataRequestedByUser = true;
      this.forceAllFocusWindowsSearch = true;
      this.search();
    }  
  }

  /**
  * Remove an attribute/value filter
  */
  this.removeAttributeValueFilter = function removeAttributeValueFilter(id) {
    
    /** 
    * If we are in focus windows mode, we make sure that we re-initialize the focus map resultset
    * such that the filter get applied to the other focus maps if they get re-selected
    */
    if(this.enableFocusWindows)
    {
      this.focusMapsResults = {
        "1": null,
        "2": null,
        "3": null
      };        
    }      
    
    $("#attributeFilterImage_"+id).attr("src", this.imagesFolder+"magnifier_zoom_in.png"); 
    $("#attributeFilterImage_"+id).attr("title", "Add a value to filter by");  
      
    delete this.attributeValueFilters[this.filtersAttributes[id].uri];
    
    this.checkedFiltersAttributes.splice(this.checkedFiltersAttributes.indexOf(this.filtersAttributes[id].uri), 1);
    
    delete this.checkedFiltersAttributes[this.filtersAttributes[id].uri];

    this.session.fa = this.checkedFiltersAttributes;
    this.session.av = this.attributeValueFilters;
    
    this.dataRequestedByUser = true;
    this.forceAllFocusWindowsSearch = true;
    this.search();
  }

  /**
  * Get the title of all the datasets accessible to that user
  */
  this.getDatasetsTitles = function getDatasetsTitles() {                                             
    unparsedResultset = $.ajax({type: "GET",
                                url: this.structWSFAddress.replace(/\/+$/,"") + "/dataset/read/?uri=all",
                                dataType: "json",
                                async: false}).responseText;
    
    var resultset = new Resultset(JSON.parse(unparsedResultset));
    
    var titles = {};

    for(var s in resultset.subjects)      
    {
      if(resultset.subjects.hasOwnProperty(s)) 
      {
        var subject = resultset.subjects[s];
        
        var title = subject.getPredicateValues("http://purl.org/dc/terms/title");
        
        titles[subject.uri] = title[0];
      }
    }
    
    $.cookie('webmap-datasetsTitles', escape(JSON.stringify(titles)), { expires: 365, path: "/" });  
    
    this.datasetsTitles = titles;  
  }

  
  this.submitFilterEnter = function submitFilterEnter(field, e) {
    var keycode;
    
    if(window.event) 
    {
      keycode = window.event.keyCode; 
    }
    else if(e)
    {
      keycode = e.which; 
    }
    else 
    {
      return true; 
    }

    if (keycode == 13)
    {
      var inputID = field.id.substring(field.id.lastIndexOf("_") + 1);
      
      this.attributeValueFilter(inputID);

      return false;
    }
    else
    {
      return true;
    }
  }

  /**
  * URLEncode a string (PHP style)
  * 
  * @param str The string to encode
  */
  this.urlencode  = function urlencode(str) {
      // http://kevin.vanzonneveld.net
      // +   original by: Philip Peterson
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: AJ
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: travc
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Lars Fischer
      // +      input by: Ratheous
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Joris
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // %          note 1: This reflects PHP 5.3/6.0+ behavior
      // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
      // %        note 2: pages served as UTF-8
      // *     example 1: this.urlencode('Kevin van Zonneveld!');
      // *     returns 1: 'Kevin+van+Zonneveld%21'
      // *     example 2: this.urlencode('http://kevin.vanzonneveld.net/');
      // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
      // *     example 3: this.urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
      // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
      str = (str + '').toString();

      // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
      // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
      return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
      replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
  }    

  /**
  * Get all the parameters of the URL of the current page
  * 
  * from: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html    
  */
  this.getUrlVars = function getUrlVars() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }

  /**
  * Tells the browser that he as to wait (block the UI)
  */
  this.startWaiting = function startWaiting() {
    $.blockUI({overlayCSS:  {opacity: 0}, message: ''});
  }

  /**
  * Tells the browser to stop waiting (unblock the UI)
  */
  this.stopWaiting = function stopWaiting() {
    $.unblockUI();
  }

  /**
  * Display the help tips
  */
  this.displayHelpTipsHover = function displayHelpTipsHover(id, title, gravity) {
    $('#' + id).tipsy({fade: true, trigger: 'manual', gravity: gravity, title: function() { return(title); }});
      
    $('#' + id).mouseover(function() {
      $(this).tipsy('show');
    });
      
    $('#' + id).mouseout(function() {
      $(this).tipsy('hide');   
    }); 
  }

  this.getResultDefinition = function getResultDefinition(subject) {
    var dataset = subject.getPredicateValues("http://purl.org/dc/terms/isPartOf")[0];
    var lat = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#lat")[0];
    var lgt = subject.getPredicateValues("http://www.w3.org/2003/01/geo/wgs84_pos#long")[0];
    
    var markerImageUrl = "";
    
    if(lat != undefined && lgt != undefined && lat.length > 0 && lgt.length > 0)
    {
      for(var sh = 0; sh < this.schemas.length; sh++)
      {
        var type = this.schemas[sh].getType(subject.type);
        
        if(type != null)
        {
          if(type.mapMarkerImageUrl != undefined &&
             type.mapMarkerImageUrl != null)
          {
            markerImageUrl = type.mapMarkerImageUrl[0];               
            break;
          }
        }
      }
    }
    
    var polygonColor = "";
    
    var polygonCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polygonCoordinates");
    
    if(polygonCoordinates.length > 0)
    {
      // First check if there is a color defined for this specific record.
      // If there is none, then we check if there is one associated
      // with the type of the record.
      
      var color = "#CA2251";
      
      var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
      
      if(scoColor.length > 0)
      {
        color = scoColor[0];
      }
      else
      {
        for(var s = 0; s < self.schemas.length; s++)
        {
          var polygonType = self.schemas[s].getType(subject.type);
          
          if(polygonType != null)
          {              
            if(polygonType.color != null)
            {
              color = polygonType.color[0];
            }
          }
        }      
      }
      
      //polygonColor = "0xCA2251";
      polygonColor = color;
    }                
    
    var polylineColor = "";
    
    var polylineCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polylineCoordinates");
    
    if(polylineCoordinates.length > 0)
    {
      // First check if there is a color defined for this specific record.
      // If there is none, then we check if there is one associated
      // with the type of the record.
      var color = "#CA2251";

      var scoColor = subject.getPredicateValues("http://purl.org/ontology/sco#color");
      
      if(scoColor.length > 0)
      {
        color = scoColor[0];
      }
      else
      {      
        for(var s = 0; s < self.schemas.length; s++)
        {
          var polylineType = self.schemas[s].getType(subject.type);
          
          if(polylineType != null)
          {              
            if(polylineType.color != null)
            {
              color = polylineType.color[0];
            }
          }
        }       
      }
      
      polylineColor = color;
    }     
    
    var typePreflabel = "";
    
    for(var sh = 0; sh < this.schemas.length; sh++)
    {
      var type = this.schemas[sh].getType(subject.type);
      
      if(type != null)
      {
        typePreflabel = type.prefLabel;
        break;
      }
    }     
    
    return({  uri: subject.uri,
              type: subject.type,
              typePrefLabel: typePreflabel,
              prefLabel: subject.getPrefLabel(),
              description: subject.getDescription(),
              prefURL: subject.getPrefURL(),
              dataset: (dataset != undefined ? dataset.uri : ""),
              img: "",
              markerImageUrl: markerImageUrl,
              polygonColor: polygonColor,
              polylineColor: polylineColor,
              resultset: subject
           });
  }

  /**
  * Display the select map control within the Google map control
  */
  this.SelectMapControl = function SelectMapControl(selectMapDiv, map) { 
    $(selectMapDiv).append('<select id="mapsList" name="menu">'+self.getMapsListBoxOptions()+'</select>');
    
    $(selectMapDiv).change(function() {
      
      // Make sure that we force a search query when the user load a map
      // from the map loading control on the map. That way, we make sure
      // not only to show the selected records, but the selected
      // filtering criterias as well.
      self.forceSearch = true;
      
      self.loadMap(this);
    });       
  }

  /**
  * Display the list of overlay layers to display
  */
  this.SelectMapLayersControl = function SelectMapLayersControl(selectLayerDiv, divClass, map) { 
    
    var selector = '<select class="'+divClass+'" name="menu">';

    selector += '<option value="Layer..." selected>Layer...</option>';      
    
    for(var i = 0; i < self.mapLayers.length; i++)
    {
      selector += '<option value="'+self.mapLayers[i].name+'">'+self.mapLayers[i].name+'</option>';      
    }
    
    selector += '</select>';
    
    $(selectLayerDiv).append(selector);
    
    $(selectLayerDiv).change(function() {
      self.switchLayer(this, map);
    });       
  }

  /**
  * Display the save map control within the Google map control
  */
  this.SaveButtonControl = function SaveButtonControl(saveButtonDiv, map) {
    $(saveButtonDiv).append('<input type="submit" value="'+self.labels.saveSessionButton+'" id="saveMapButtonControl">');
    $(saveButtonDiv).tipsy({fade: true, gravity: 'n', title: function() { return("Save the state of the current map"); }});
    
    $(saveButtonDiv).click(function() {
      self.saveMapPanel();
    });         
  }

  /**
  * Display the delete map control within the Google map control
  */  
  this.DeleteButtonControl = function DeleteButtonControl(deleteButtonDiv, map) {
    $(deleteButtonDiv).append('<input type="submit" value="'+self.labels.deleteSessionButton+'" id="deleteMapButtonControl">');
    $(deleteButtonDiv).tipsy({fade: true, gravity: 'n', title: function() { return("Delete the current loaded map"); }});
    
    $(deleteButtonDiv).click(function() {
      self.deleteMap();
    });         
  }

  /**
  * Display the link map control within the Google map control
  */  
  this.LinkButtonControl = function LinkButtonControl(linkButtonDiv, map) {
    $(linkButtonDiv).append('<input type="submit" value="'+self.labels.shareSessionButton+'" id="shareMapButtonControl">');
    $(linkButtonDiv).tipsy({fade: true, gravity: 'n', title: function() { return("Get a link to share this map with your friends and family"); }});
    
    $(linkButtonDiv).click(function() {
      self.linkMapPanel();
    });         
  }

  /**
  * Display the inclusion map control within the Google map control
  */  
  this.InclusionButtonControl = function InclusionButtonControl(inclusionButtonDiv, map) {
    if(this.includeResultsInTargetInclusionRecords)
    {  
      $(inclusionButtonDiv).append('<input type="submit" id="inclusionButtonInput" value="'+self.labels.inclusionRecordsButtonOff+'">');
    }
    else
    {
      $(inclusionButtonDiv).append('<input type="submit" id="inclusionButtonInput" value="'+self.labels.inclusionRecordsButtonOn+'">');
    }
    
    $(inclusionButtonDiv).click(function() {
      self.toggleInclusionRecordsFilter();
    });         
    
    $(inclusionButtonDiv).tipsy({fade: true, gravity: 'n', title: function() { return("Shows results in/out the region boundaries"); }});
  }

  /**
  * Zoom the google map to fit all the records currently displayed on the map
  */
  this.zoomToTaggedRecords = function zoomToTaggedRecords(){       
    var latlngbounds = new google.maps.LatLngBounds( );

    for(var uri = 0; uri < this.taggedRecords.length; uri++)
    {
      for(var p = 0; p < this.polygons.length; p++)   
      {
        if(this.polygons[p].data.uri == this.taggedRecords[uri])
        {
          latlngbounds = latlngbounds.union(this.polygons[p].bounds);
        }
      }        
      
      for(var p = 0; p < this.polylines.length; p++)   
      {
        if(this.polylines[p].data.uri == this.taggedRecords[uri])
        {
          latlngbounds = latlngbounds.union(this.polylines[p].bounds);
        }
      }        
     
      for(var m = 0; m < this.markers.length; m++)   
      {
        if(this.markers[m].data.uri == this.taggedRecords[uri])
        {
          latlngbounds = latlngbounds.extend(this.markers[m].getPosition());
        }
      }
    }  
    
    this.map.fitBounds(latlngbounds);  
  }

  this.hideTargetFocusWindowRecords = function hideTargetFocusWindowRecords(focusWindowID) {
    
    var resultset = new Resultset(this.focusMapsResults[focusWindowID]);
    
    if(resultset)
    {
      /** Hide all markers, and only shows the ones that have to be displayed */
      for(var m = 0; m < this.markers.length; m++)   
      {
        /** Hide all markers of this focus window except the tagged ones */
        if(this.taggedRecords.indexOf(this.markers[m].data.uri) < 0)
        {
          if(resultset.getSubject(this.markers[m].data.uri))
          {
            this.markers[m].setVisible(false);
          }
        }
      }    
      
      
      /** Hide all polygons, and only shows the ones that have to be displayed */
      for(var p = 0; p < this.polygons.length; p++)   
      {
        // Hide all polygons except the tagged ones
        if(this.taggedRecords.indexOf(this.polygons[p].data.uri) < 0)
        {
          if(resultset.getSubject(this.polygons[p].data.uri))
          {
            this.polygons[p].setMap(null);
          }
        }
      }        
      
      /** Hide all polylines, and only shows the ones that have to be displayed */
      for(var p = 0; p < this.polylines.length; p++)   
      {
        // Hide all polylines except the tagged ones
        if(this.taggedRecords.indexOf(this.polylines[p].data.uri) < 0)
        {
          if(resultset.getSubject(this.polylines[p].data.uri))
          {        
            this.polylines[p].setMap(null);
          }
        }
      }      
    }
  }
  
  /**
  * Hide all the records that are not tagged
  */
  this.hideUntaggedRecords = function hideUntaggedRecords() {

    if(this.enableFocusWindows)
    {
      var taggedMarkers = [];      
    }
    
    /** Hide all markers, and only shows the ones that have to be displayed */
    for(var m = 0; m < this.markers.length; m++)   
    {
      /** Hide all markers except the tagged ones */
      if(this.taggedRecords.indexOf(this.markers[m].data.uri) < 0)
      {
        if(this.enableFocusWindows)
        {
          this.markers[m].setMap(null);
        }
        else
        {
          this.markers[m].setVisible(false); 
        }
      }
      else
      {
        if(this.enableFocusWindows)
        {        
          taggedMarkers.push(this.markers[m]);
        }
      }
    }    
    
    if(this.enableFocusWindows)
    {
      this.markers = taggedMarkers;
    }
    
    
    /** Hide all polygons, and only shows the ones that have to be displayed */
    for(var p = 0; p < this.polygons.length; p++)   
    {
      // Hide all polygons except the tagged ones
      if(this.taggedRecords.indexOf(this.polygons[p].data.uri) < 0)
      {
        this.polygons[p].setMap(null);
      }
    }        
    
    /** Hide all polylines, and only shows the ones that have to be displayed */
    for(var p = 0; this.polylines < this.polylines.length; p++)   
    {
      // Hide all polylines except the tagged ones
      if(this.taggedRecords.indexOf(this.polylines[p].data.uri) < 0)
      {
        this.polylines[p].setMap(null);
      }
    }  
  }

  this.toggleInclusionRecordsFilter = function toggleInclusionRecordsFilter() {
    if(this.includeResultsInTargetInclusionRecords)
    {
      this.includeResultsInTargetInclusionRecords = false;
      $("#inclusionButtonInput").val(this.labels.inclusionRecordsButtonOff);
    }
    else
    {
      this.includeResultsInTargetInclusionRecords = true;
      $("#inclusionButtonInput").val(this.labels.inclusionRecordsButtonOn);
    }
    
    this.dataRequestedByUser = true;
    this.forceAllFocusWindowsSearch = true;
    this.search();
  }  
  
  /**
  * Open an overlay that display the description of the record
  * The content of this overlay is the templated version of the record by conStruct
  * 
  * @param subjectID The ID of the subject to display in the overlay. This ID is the ID of the item in the resultset
  *                  list in the user interface.
  * @param tagged Specifies if the record to display in the overlay as been tagged or not.
  * 
  * @see http://techwiki.openstructs.org/index.php/Building_conStruct_Templates
  */
  this.openRecordDescriptionOverlay = function openRecordDescriptionOverlay(subjectID, tagged) {
    
    var targetCanvasId = 'webMap';
    
    if(this.enableFocusWindows)
    {
      targetCanvasId = 'resultsCanvas';
    }
    
    var resultsBoxPosition = $('#' + targetCanvasId).position();
    
    $('#recordDescriptionOverlay').css({
      position: 'absolute',
      top: resultsBoxPosition.top,
      left: resultsBoxPosition.left,
      width: $('#' + targetCanvasId).css('width'),
      height: $('#' + targetCanvasId).css('height')
    }); 
    
    var resourceSource = "";
    
    if(tagged)
    {
      resourceSource = "http://"+document.domain+"/conStruct/view/?uri="+this.urlencode(this.taggedResults[subjectID].uri)+"&dataset="+this.urlencode(this.taggedResults[subjectID].dataset);       
    }
    else
    {
      resourceSource = "http://"+document.domain+"/conStruct/view/?uri="+this.urlencode(this.results[subjectID].uri)+"&dataset="+this.urlencode(this.results[subjectID].dataset);       
    }
    
    var resourceSourceTemplate = resourceSource + '&mime=template%2Fhtml';       
    
    $('#recordDescriptionOverlay').html('\
         <div style="width: 100%; height: 100%">\
           <img id="recordDescriptionOverlayClose" title="Close popup" src="'+this.imagesFolder+'cross.png" style="position:relative; float: right; cursor: pointer; top: 3px; right: 3px;" />\
           <img id="recordDescriptionOverlayOpen" title="Open in another window" src="'+this.imagesFolder+'application_double.png" style="position:relative; float: right; cursor: pointer; top: 4px; right: 9px;" />\
           <iframe id="recordDescriptionFrame" src="'+resourceSourceTemplate+'" frameBorder="0" />\
         </div>');
    
    $('#recordDescriptionOverlay > div').append('<div id="recordDescriptionLoading"><img src="'+this.imagesFolder+'/ajax-loading-bar.gif" /></div>');

    $('#recordDescriptionLoading').css({
      position: 'absolute',
      top: resultsBoxPosition.top - (($('#' + targetCanvasId).height() / 2) + 10),
      left: resultsBoxPosition.left + (($('#' + targetCanvasId).width() / 2) -  110)
    });            
         
    $('#recordDescriptionFrame').css({
      width: $('#' + targetCanvasId).css('width'),
      height: ($('#' + targetCanvasId).height() - 16) + "px",
      "padding-top": "16px",
      "overflow-x": "hidden"
    });         
    
    $('#recordDescriptionFrame').hide();          
        
    $('#recordDescriptionFrame').load(function() {
      
      $('#recordDescriptionLoading').remove();
      $('#recordDescriptionFrame').contents().find('head').append(self.recordDisplayCss)
      $('#recordDescriptionFrame').contents().find('a').attr("target", "_new");
      
      var pageTitle = $('#recordDescriptionFrame').contents().find('title').text();
      $('#recordDescriptionFrame').contents().find('body').prepend('<h1>'+pageTitle+'</h1>')
      
      $('#recordDescriptionFrame').show();      
    });         
    
    $('#recordDescriptionOverlayClose').click(function (){
      self.closeRecordDescriptionOverlay();
    });
    
    $('#recordDescriptionOverlayOpen').click(function (){
      window.open(resourceSource, "_blank");
      self.closeRecordDescriptionOverlay();
    });
    
    $('#recordDescriptionOverlay').fadeIn('fast', function() {});              
  }
  
  this.closeRecordDescriptionOverlay = function closeRecordDescriptionOverlay() {
    $('#recordDescriptionOverlay').fadeOut('fast', function() {
      $('#recordDescriptionOverlay').empty();
    });    
  }
  
  this.resetDirections = function resetDirections() {
    
    this.directionsFromHere = null;
    this.directionsToHere = null;
    
    this.directionsDisplay.main.setMap(null);

    if(this.enableFocusWindows)
    {
      this.directionsDisplay["focus1"].setMap(null);
      this.directionsDisplay["focus2"].setMap(null);
      this.directionsDisplay["focus3"].setMap(null);
    }    
    
    this.directionsDisplay.main = new google.maps.DirectionsRenderer();   
    this.directionsDisplay.main.setMap(this.map);
    this.directionsDisplay.main.setPanel(document.getElementById("directionsPanel"));

    if(this.enableFocusWindows)
    {
      this.directionsDisplay["focus1"] = new google.maps.DirectionsRenderer();
      this.directionsDisplay["focus1"].setMap(this.focusMaps[0]);
      
      this.directionsDisplay["focus2"] = new google.maps.DirectionsRenderer();
      this.directionsDisplay["focus2"].setMap(this.focusMaps[1]);

      this.directionsDisplay["focus3"] = new google.maps.DirectionsRenderer();
      this.directionsDisplay["focus3"].setMap(this.focusMaps[2]);
    }
  }
  
  /**
  * Open an overlay that display the directions pannel between two markers.
  */
  this.openDirectionsOverlay = function openDirectionsOverlay() {
    
    var targetCanvasId = 'webMap';
    
    if(this.enableFocusWindows)
    {
      targetCanvasId = 'resultsCanvas';
    }
    
    var resultsBoxPosition = $('#' + targetCanvasId).position();
    
    $('#directionsOverlay').css({
      "background-color": '#F2F1ED',
      position: 'absolute',
      top: resultsBoxPosition.top,
      left: resultsBoxPosition.left,
      width: $('#' + targetCanvasId).css('width'),
      height: $('#' + targetCanvasId).css('height')
    });       
    
    $('#directionsOverlayClose').attr('src', this.imagesFolder+'cross.png');
    
    $('#directionsOverlayClose').click(function (){
      self.closeDirectionsOverlay();
    });
    
    $('#directionsPanelControls').show();
    $('#directionsOverlay').fadeIn('fast', function() {});              
  }
  
  this.closeDirectionsOverlay = function closeDirectionsOverlay() {
    $('#directionsOverlay').fadeOut('fast', function() {
      $('#directionsPanel').empty();
      self.resetDirections();
    });    
  }  
  
  this.drawFocusPolygon = function drawFocusPolygon(focusMap, color) {
    
    color = this.hexc(color);
    
    var markerImage = new google.maps.MarkerImage(this.imagesFolder + 'arrow_out.png', new google.maps.Size(16, 16), new google.maps.Point(0,0), new google.maps.Point(8,8));
    
    var marker = new google.maps.Marker({
      map: this.map,
      position: focusMap.map.getBounds().getCenter()/*new google.maps.LatLng(focusMap.map.getBounds().getNorthEast().lat(), focusMap.map.getBounds().getNorthEast().lng())*/,
      draggable: true,
      title: 'Move focus window',
      icon: markerImage
    });
    
    marker.focusMap = focusMap;
    
    var rectangle = new google.maps.Rectangle({ 
      map: this.map,
      fillColor: color,
      fillOpacity: '0.3',
      strokeWeight: 1,
      strokeColor: color,
      bounds: focusMap.map.getBounds()
    });    
    
    var rectangleBounds = rectangle.getBounds();    
    
    // Now we have to calculate the proportions of the focus window.
    // We have to calculate a ratio that will be applied to the distance
    // of the computed offset such that we keep the same form between
    // the focus window, and the outlined area on the big map.
    var ne = focusMap.map.getBounds().getNorthEast();
    var sw = focusMap.map.getBounds().getSouthWest();    
    
    var rectWidth = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(ne.lat(), ne.lng()), new google.maps.LatLng(ne.lat(), sw.lng()));
    var rectHeight = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(ne.lat(), sw.lng()), new google.maps.LatLng(sw.lat(), sw.lng()));
    
    var widthRatio = 1;
    var heightRatio = 1;
    
    if(rectWidth > rectHeight)
    {
      widthRatio = rectHeight / rectWidth;
    }
    else
    {
      heightRatio = rectWidth / rectHeight;
    }
    
    rectangleBounds.extend(google.maps.geometry.spherical.computeOffset(focusMap.map.getBounds().getCenter(), focusMap.sWebMap.minimalFocusWindowRectangleRadius * widthRatio, 0));
    rectangleBounds.extend(google.maps.geometry.spherical.computeOffset(focusMap.map.getBounds().getCenter(), focusMap.sWebMap.minimalFocusWindowRectangleRadius * heightRatio, 90));
    rectangleBounds.extend(google.maps.geometry.spherical.computeOffset(focusMap.map.getBounds().getCenter(), focusMap.sWebMap.minimalFocusWindowRectangleRadius * widthRatio, 180));
    rectangleBounds.extend(google.maps.geometry.spherical.computeOffset(focusMap.map.getBounds().getCenter(), focusMap.sWebMap.minimalFocusWindowRectangleRadius * heightRatio, 270));
        
    focusMap.map.bindTo('center', marker, 'position');
    
    rectangle.bindTo('bounds', focusMap.map, 'position');
    
    rectangle.setBounds(rectangleBounds);
    
    rectangle.focusMap = focusMap;
    
    google.maps.event.addListener(marker, 'dragend', function(){    
      if(self.searchOnDrag && self.dataRequestedByUser)
      { 
        self.selectedFocusMapID = this.focusMap.focusMapID;
        
        this.focusMap.toggleFocusWindowSelection();
        self.searchMap(this.focusMap.map);
      }
    });    
    
    return(rectangle);   
  }
  
  this.hexc = function hexc(colorval) 
  {
    if(colorval.indexOf("rgb(") == -1)
    {
      if(colorval.indexOf("#") == -1)
      {
        return('#' + colorval);
      }
      else
      {
        return(colorval);
      }
    }
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    
    delete(parts[0]);
    
    for(var i = 1; i <= 3; ++i) 
    {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    
    return('#' + parts.join(''));
  }
  
  
  /** Create the map! */
  this.createWebMap(canvas);   
  
  /** 
  * If the window resizes, we make sure that the controls that had their width and height calculated by
  * the code get properly resized as well.
  */
  $(window).resize(function() {    
    $('#webMap').width($('#webMap').parent().width());
    
    /** Set the size such that it doesn't change when filters get applied */
    $('.webMapFiltersTd').width($('#webMap').width() * 0.35);
    $('.webMapResultsTd').width($('#webMap').width() * 0.65);
    
    if(self.enableFocusWindows)
    {   
      $('#mapFocus1').css("width","100%");
      $('#mapFocus2').css("width","100%");
      $('#mapFocus3').css("width","100%");
      
      $('#mapFocus1').width($('#mapFocus1').width());
      $('#mapFocus2').width($('#mapFocus2').width());
      $('#mapFocus3').width($('#mapFocus3').width());
    }                               
  });  
  
  this.switchLayer = function switchLayer(obj, map) {
  
    var selectedName = $(obj).children(":first").get(0).value;
    
    if(map.overlayMapTypes.getLength() > 0)
    {
      map.overlayMapTypes.removeAt(0);
    }
        
    for(var i = 0; i < this.mapLayers.length; i++)
    {
      if(this.mapLayers[i].name == selectedName)
      {
        if(this.mapLayers[i].type == "wms")
        {
          loadWMSOverlay(map, this.mapLayers[i].baseUrl, this.mapLayers[i].wmsParams, this.mapLayers[i].name);  
        }
        else
        {
          map.overlayMapTypes.insertAt(0, new google.maps.ImageMapType(this.mapLayers[i].getTileUrl));
        }
      }
    }
        
  }  
}

function SWebMapFocus()
{
  /**
  * Internal variables of all kind.
  */
  
  /** Self reference for total closure */
  var self = this;
  
  /** Focus polygon of the parent map */
  this.focusPolygon = null;
  
  /** Focus map object */
  this.map;
  
  /** ID of the focus map */
  this.focusMapID;
  
  /** Reference to the main sWebMap control */
  this.sWebMap;
  
  /** Color used for this focus map */
  this.color;
  
  this.createFocusMap = function createFocusMap(sWebMap, mapFocusContainerElement) {
    
    this.sWebMap = sWebMap;
    
    this.color = $('#' + mapFocusContainerElement).css("background-color");
    
    this.focusMapID = mapFocusContainerElement.substring(mapFocusContainerElement.length - 1);
    
    // Create the google this.map
    var latlong = new google.maps.LatLng(this.sWebMap.focusMapsCenterPositions["focusMap" + this.focusMapID].lat, this.sWebMap.focusMapsCenterPositions["focusMap" + this.focusMapID].lng);
    
    var mapOptions = {
      zoom: this.sWebMap.focusMapsCenterPositions["focusMap" + this.focusMapID].zoom,
      center: latlong,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    if(this.sWebMap.focusMapShowZoomControl)
    {    
      mapOptions.zoomControl = true;
    }
    
    if(this.sWebMap.focusMapShowMapTypeControl)
    {
      mapOptions.mapTypeControl = true;
    }
    
    if(this.sWebMap.focusMapShowStreetViewControl)
    {
      mapOptions.streetViewControl = true;
    }
    
    /*
    if(this.sWebMap.focusMapShowPanControl)
    {
      mapOptions.panControl = true;
    } */
    
    if(!this.sWebMap.mapTypeIds)
    {
      for(var type in google.maps.MapTypeId) 
      {
        this.sWebMap.mapTypeIds.push(google.maps.MapTypeId[type]);
      }
    }
    
    mapOptions.mapTypeControlOptions = {
      "mapTypeIds": this.sWebMap.mapTypeIds,
      "style": google.maps.MapTypeControlStyle.DROPDOWN_MENU
    };      
    
    this.map = new google.maps.Map(document.getElementById(mapFocusContainerElement), mapOptions);    
    
    if(this.sWebMap.enableDirectionsService)
    {
      this.sWebMap.directionsDisplay["focus" + this.focusMapID] = new google.maps.DirectionsRenderer();
      this.sWebMap.directionsDisplay["focus" + this.focusMapID].setMap(this.map);
    }
    
    // Register all external image map types functions used to deliver the URL queries.    
    for(var it = 0; it < this.sWebMap.mapTypes.length; it++)
    {
      if(this.sWebMap.mapTypes[it].type == "wms")
      {
        this.sWebMap.map.mapTypes.set(this.sWebMap.mapTypes[it].id, getWMSMapType(this.map, this.sWebMap.mapTypes[it].baseUrl, this.sWebMap.mapTypes[it].wmsParams, this.sWebMap.mapTypes[it].name));  
      }
      else
      {
        this.map.mapTypes.set(this.sWebMap.mapTypes[it].id, new google.maps.ImageMapType(this.sWebMap.mapTypes[it].getTileUrl));  
      }
    }    
    
    google.maps.event.addListenerOnce(this.map, 'idle', function(){
      
      /** Remove the default google background color generated by the map api */
      $("#mapFocus" + self.focusMapID).css("background-color", ""); 
            
      /** Add the overlay layers selection tool if needed */      
      if(self.sWebMap.mapLayers.length > 0)
      {
        var selectMapLayersDiv = document.createElement('DIV');
        selectMapLayersDiv.id = "selectMapLayersDiv" + "_focus_" + self.focusMapID;
        var selectMapControl = new self.sWebMap.SelectMapLayersControl(selectMapLayersDiv, 'focusMapLayersList', self.map);
        
        selectMapLayersDiv.index = 1;
        self.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(selectMapLayersDiv);         
      }               
            
      google.maps.event.addListener(self.map, 'bounds_changed', function(){    
        if(self.focusPolygon != null)
        {
          /** Set the minimum size of the bounding rectangle, on the main map, that represent the focus window */          
          var focusMapBounds = self.map.getBounds();

          // Now we have to calculate the proportions of the focus window.
          // We have to calculate a ratio that will be applied to the distance
          // of the computed offset such that we keep the same form between
          // the focus window, and the outlined area on the big map.
          var ne = self.map.getBounds().getNorthEast();
          var sw = self.map.getBounds().getSouthWest();    
          
          var rectWidth = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(ne.lat(), ne.lng()), new google.maps.LatLng(ne.lat(), sw.lng()));
          var rectHeight = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(ne.lat(), sw.lng()), new google.maps.LatLng(sw.lat(), sw.lng()));
          
          var widthRatio = 1;
          var heightRatio = 1;
          
          if(rectWidth > rectHeight)
          {
            widthRatio = rectHeight / rectWidth;
          }
          else
          {
            heightRatio = rectWidth / rectHeight;
          }
          
          focusMapBounds.extend(google.maps.geometry.spherical.computeOffset(self.map.getBounds().getCenter(), self.sWebMap.minimalFocusWindowRectangleRadius * widthRatio, 0))
          focusMapBounds.extend(google.maps.geometry.spherical.computeOffset(self.map.getBounds().getCenter(), self.sWebMap.minimalFocusWindowRectangleRadius * heightRatio, 90))
          focusMapBounds.extend(google.maps.geometry.spherical.computeOffset(self.map.getBounds().getCenter(), self.sWebMap.minimalFocusWindowRectangleRadius * widthRatio, 180))
          focusMapBounds.extend(google.maps.geometry.spherical.computeOffset(self.map.getBounds().getCenter(), self.sWebMap.minimalFocusWindowRectangleRadius * heightRatio, 270))
          
          self.focusPolygon.setBounds(focusMapBounds);
               
          if(self.focusMapID == self.sWebMap.selectedFocusMapID)
          {
            self.toggleFocusWindowSelection();
          }
        }
      });

      google.maps.event.addListener(self.map, 'dragend', function(){   
        if(self.sWebMap.searchOnDrag && self.sWebMap.dataRequestedByUser)
        { 
          self.sWebMap.selectedFocusMapID = self.focusMapID;
          self.sWebMap.forceAllFocusWindowsSearch = false;
          self.sWebMap.search();
        }
      });
            
      google.maps.event.addListener(self.map, 'zoom_changed', function(){    
        if(self.sWebMap.searchOnZoomChanged && self.sWebMap.dataRequestedByUser)
        { 
          self.sWebMap.selectedFocusMapID = self.focusMapID;
          self.sWebMap.forceAllFocusWindowsSearch = false;
          self.sWebMap.search();
        }
      });
            
      google.maps.event.addListener(self.map, 'click', function(){   
        
        self.sWebMap.selectedFocusMapID = self.focusMapID;

        self.toggleFocusWindowSelection();
        
        if(self.sWebMap.focusMapsResults[self.focusMapID] != null)
        {
          self.sWebMap.prepareDisplayResults(self.sWebMap.focusMapsResults[self.focusMapID], self.map);
        }
        else
        {
          self.sWebMap.dataRequestedByUser = true;
          self.sWebMap.forceAllFocusWindowsSearch = false;
          self.sWebMap.search();
        }
        
      });
      
      // We pre-select the first focus window
      if(self.focusMapID == 1)
      {
        self.toggleFocusWindowSelection();
        self.sWebMap.selectedFocusMapID = self.focusMapID;
        self.sWebMap.dataRequestedByUser = true;
        self.sWebMap.forceAllFocusWindowsSearch = false;
        self.sWebMap.search();        
      }
    });    
  }
  
  this.toggleFocusWindowSelection = function toggleFocusWindowSelection() {
    
    $('#mapFocus' + self.focusMapID).removeClass('mapFocus' + self.focusMapID + '_unselected');
    $('#mapFocus' + self.focusMapID).addClass('mapFocus' + self.focusMapID + '_selected');
    
    if(self.focusMapID != 1)
    {
      $('#mapFocus1').removeClass('mapFocus1_selected');
      $('#mapFocus1').addClass('mapFocus1_unselected');
    }
    
    if(self.focusMapID != 2)
    {
      $('#mapFocus2').removeClass('mapFocus2_selected');
      $('#mapFocus2').addClass('mapFocus2_unselected');
    }
    
    if(self.focusMapID != 3)
    {
      $('#mapFocus3').removeClass('mapFocus3_selected');
      $('#mapFocus3').addClass('mapFocus3_unselected');
    }    
  }  
}
