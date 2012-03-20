
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
  
  this.labels.searchButton = (typeof options.labels.searchButton != "undefined" ? options.labels.searchButton : "Search");
  this.labels.searchInput = (typeof options.labels.sesearchInputarchButton != "undefined" ? options.labels.searchInput : "Search Map");
  this.labels.saveSessionButton = (typeof options.labels.saveSessionButton != "undefined" ? options.labels.saveSessionButton : "save");
  this.labels.deleteSessionButton = (typeof options.labels.deleteSessionButton != "undefined" ? options.labels.deleteSessionButton : "delete");
  this.labels.shareSessionButton = (typeof options.labels.shareSessionButton != "undefined" ? options.labels.shareSessionButton : "share");
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
                                                    <div id="mapActionsButtons" class="mapActionsButtons"></div>\
                                                    <div id="taggedRecordsBox" class="taggedRecordsBox"></div>\
                                                    <div id="resultsBox" class="resultsBox"></div>\
                                                    <div id="resultsPaginator" class="resultsPaginator"></div>\
                                                  </div>\
                                                </td>\
                                                <td class="webMapFiltersTd" valign="top">\
                                                  <div id="webMapFilters" class="webMapFilters">\
                                                  </div>\
                                                </td>\
                                              </tr>\
                                            </tbody>\
                                          </table>\
                                          <div id="recordDescriptionOverlay" />');

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
    
    this.map = new google.maps.Map(document.getElementById("webMapMain"), mapOptions);    
    
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
      
   


      /** Remove the default google background color generated by the this.map api */
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
            self.search();
          }
          else
          {
            if(self.displayFiltersByDefault)
            {
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
      this.searchMap(this.focusMaps[this.selectedFocusMapID - 1].map);
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
    
    /** Possibly contraining this.results to target neighbourhoods */
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
    
    /** Get the coordinates of the squares of the current view this.map */
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
            "&range_filter=" + topRight.lat()+";"+topRight.lng()+";"+bottomLeft.lat()+";"+bottomLeft.lng(),
      dataType: "json",
      targetMap: targetMap,
      success: function(rset)
      {
        if(this.targetMap.b.id == "mapFocus1")
        {
          self.focusMapsResults["1"] = rset;
        }
        
        if(this.targetMap.b.id == "mapFocus2")
        {
          self.focusMapsResults["2"] = rset;
        }
        
        if(this.targetMap.b.id == "mapFocus3")
        {
          self.focusMapsResults["3"] = rset;
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
        $("#resultsBox").html('<p id="searchOrFilterExplanationText">Perform Search or select Source or Kinds filters to right to populate results</span>');
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

    self.hideUntaggedRecords();        
 
    /** Show/add this.markers for the records in the filtered resultset */
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
          
          if(marker.data.uri == subject.uri)
          {
            found = true;
            marker.setVisible(true);
            break;
          }
        }
        
        if(!found)
        {
          /** Display markers on the this.map */
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
            
            self.markers.push(marker);
          }
        }
        
        /** Make sure self polygon is not already displayed on the this.map */
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
                strokeColor: "#CA2251",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#CA2251",
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
                strokeColor: "#CA2251",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#CA2251",
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
                self.infobox.hide();
              });
              
              google.maps.event.addListener(polyline, 'mouseover', function() {
                self.infobox.show();
                self.featureOver(this.data.uri);
              });
              
              google.maps.event.addListener(polygon, 'mousemove', function(e) {
                this.infobox.setPosition(e.latLng);
              });              
              
              self.polylines.push(polyline);
              
              polyline.setMap(targetMap);                
            }   
          }
        }          
      }
    }  
    
    self.stopWaiting();     
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
        $("#tagged_result_column_right_"+i).append('<input type="checkbox" name="tagged_result_checkbox_' + i + '" title="Persist this result" checked>'); 
        
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
        polygon.setOptions({
                    strokeColor: "#CA2251",
                    fillColor: "#CA2251"
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
                    strokeColor: "#CA2251",
                    fillColor: "#CA2251"
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
        $("#resultsBox").html('<div class="noSearchResults">No results for the <b>"'+($("#searchInput").val() == this.labels.searchInput ? "" : $("#searchInput").val())+'"</b> search keywords and for this this.map region and selected filters. <br /><br />You can try zooming-out the this.map to get this.results elsewhere in the city.</div>');  
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
          $("#result_column_right_"+i).append('<input type="checkbox" name="result_checkbox_' + i + '" id="result_checkbox_' + i + '" title="Persist this result">'); 
          
          $("#result_column_right_" + i + " > input").click(function() {
            var id = this.parentNode.id.substring(this.parentNode.id.lastIndexOf("_") + 1);
            self.tagRecord(this, self.results[id].uri);
          });  
          
          this.displayHelpTipsHover('result_checkbox_' + i, "Persist result on map", 's');
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
            /** Display this.polygons on the map */
            var polygonCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polygonCoordinates");
            
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
                strokeColor: "#CA2251",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#CA2251",
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
                strokeColor: "#CA2251",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#CA2251",
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
    $("#webMapSearch").append('<table width="100%">\
      <tr>\
        <td width="100%"><div class="searchMapWrapper"><div class="inputMapWrapper"><input type="text" maxlength="2048" id="searchInput" class="searchBox" value="Search Map" style="font-style: italic" /></div></div></td>\
        <td width="0%"><div class="searchButtonMapWrapper"><input type="submit" class="searchButton" value=""></div></td>\
      </tr>\
    </table>');
    
    $('.searchBox').val(this.labels.searchInput);
    $('.searchButton').val(this.labels.searchButton);
    
    $('.searchButton').click(function() {
      self.dataRequestedByUser = true;
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
      this.search();
    }
    else
    {
      if(this.forceSearch)
      {
        this.dataRequestedByUser = true;
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
        this.search();
      }          
      else
      {
        if(this.displayFiltersByDefault)
        {
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
    var bounds = this.map.getBounds();
    var topRight = bounds.getNorthEast();
    var bottomLeft = bounds.getSouthWest(); 
    
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
      polygonColor = "0xCA2251";
    }                
    
    var polylineColor = "";
    
    var polylineCoordinates = subject.getPredicateValues("http://purl.org/ontology/sco#polylineCoordinates");
    
    if(polylineCoordinates.length > 0)
    {
      polylineColor = "0xCA2251";
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
      self.loadMap(this);
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
  
  this.drawFocusPolygon = function drawFocusPolygon(focusMap, color) {
    
    color = this.hexc(color);
    
    var markerImage = new google.maps.MarkerImage(this.imagesFolder + 'arrow_out.png', new google.maps.Size(16, 16), new google.maps.Point(0,0), new google.maps.Point(8,8));
    
    var marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(focusMap.map.getBounds().getNorthEast().lat(), focusMap.map.getBounds().getNorthEast().lng()),
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
    
    focusMap.map.bindTo('center', marker, 'position');
    
    rectangle.bindTo('bounds', focusMap.map, 'position');
    
    rectangle.setBounds(focusMap.map.getBounds());
    
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
    
    this.map = new google.maps.Map(document.getElementById(mapFocusContainerElement), mapOptions);    
    
    google.maps.event.addListenerOnce(this.map, 'idle', function(){
      
      /** Remove the default google background color generated by the map api */
      $("#mapFocus" + self.focusMapID).css("background-color", ""); 
            
      google.maps.event.addListener(self.map, 'bounds_changed', function(){    
        if(self.focusPolygon != null)
        {
          self.focusPolygon.setBounds(self.map.getBounds());
               
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
          self.sWebMap.search();
        }
      });
            
      google.maps.event.addListener(self.map, 'zoom_changed', function(){    
        if(self.sWebMap.searchOnZoomChanged && self.sWebMap.dataRequestedByUser)
        { 
          self.sWebMap.selectedFocusMapID = self.focusMapID;
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
          self.sWebMap.search();
        }
        
      });
      
      // We pre-select the first focus window
      if(self.focusMapID == 1)
      {
        self.toggleFocusWindowSelection();
        self.sWebMap.selectedFocusMapID = self.focusMapID;
        self.sWebMap.dataRequestedByUser = true;
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
