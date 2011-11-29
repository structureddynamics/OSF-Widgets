package
{
  import com.sd.semantic.core.Namespaces;
  import com.sd.semantic.core.Resultset;
  import com.sd.semantic.core.Subject;
  
  import flash.external.ExternalInterface;
  
  import flash.display.Sprite;
  import flash.text.TextField;
  import flash.utils.Dictionary;
  
  import org.sunlightlabs.ClearMaps.*;

  /**
   * Main map class using the ClearMaps framework.
   */
  public class MapTool extends Sprite
  {
    /** 
    * optionally using an embedded font to imporove rendering flexibliltiy
    * the library currently expects the "mapFont" font family to be defined
    */
    [Embed(source = "assets\\sans_between.ttf", fontFamily = "mapFont")]
    private var SansBetween:Class;

    /** Map object manages layers and data */
    public var map:Map;

    /** 
    * MapData objects contain data contained in CSV, XML or JSON data sources
    * this data can be bound to the map at display time
    */
    public var rawData:Data;

    /** Specifies if the control as already been initialized. */
    private var _initialized:Boolean = false;

    /** Initial height of the map component */
    private var initialHeight:Number = 0;
    
    /** Initial width of the map component */
    private var initialWidth:Number = 0;

    /** Colors used to fill each layer */
    public var layerColors:Array /* of hex colors */ = [];
    
    private var _semanticDataProvider:Resultset;
    
    /** Input records. This is a Resultset structure (see the structXML XML data structure) */
    public function get semanticDataProvider():Resultset
    {
      return (_semanticDataProvider);
    }

    public function set semanticDataProvider(value:Resultset):void
    {
      _semanticDataProvider = value;

      if(_initialized)
      {
        refreshMap();
      }
    }

    /** Map settings */    
    private var settings:MapSettings;
    
    /**
     * Constructor
     *  
     * @param settings Settings of the map control
     * @param targetAttributes Target attributes used by this component. It should have the attribute used
     *        to get the URL of the map to load.
     */
    public function MapTool(settings:MapSettings, targetAttributes:Array, semanticDataProvider:Resultset)
    {
      super();

      /** Set settings */
      this.settings = settings;
      
      /** Set target attributes */

      /** Color index to use for a specific layer */
      var iColor:int = 0;
      
      /** Set the initial semantic data provider */
      this.semanticDataProvider = semanticDataProvider;

      /** Create the map */
      this.map = new Map();

      /** center map */
//      this.map.x += this.settings.initialLeft;
//      this.map.y += this.settings.initialTop;      
      
      /** listen for map ready event to process/visualize data */
      this.map.addEventListener(MapEvent.READY, mapReadyHandler);

      /** URL of the map to load in this component. */
      var mapUrl:String = "";

      /** Namespaces definition of the application */
      var namespaces:Namespaces = new Namespaces();
      
      /** Map GIS map to be displayed for that record */
      var gisMap:Layer;
      
      /** 
      * Keep track of the URL of the maps that we have to layer. This is to make sure that we
      * don't layer two times the same map
      */
      var layeredMaps:Array = [];
      
      /** Get the map file to use from the target records */
      for each(var targetAttribute:String in targetAttributes)
      {
        for each(var subject:Subject in this._semanticDataProvider.subjects)
        {
          var mapValues:Array = subject.getPredicateValues(targetAttribute);
          
          if(mapValues.length > 0)
          {
            for each(var mapValue:Array in mapValues)
            {
              mapUrl = mapValue["value"];
              
              /** Make sure we don't layer the same map two times. */
              if(layeredMaps.indexOf(mapUrl) == -1)
              {
                layeredMaps.push(mapUrl);
              }
              else
              {
                break;
              }
              
              var name:String = "";
              var recordBaseUrl:String = "";
              var recordBaseUri:String = "";
              var recordDataset:String = "";
              
              /** Check if we have a name defined for the layer's file URL */
              if(this.settings.layersUrl.indexOf(mapUrl) != -1 && 
                 this.settings.layersName.length > this.settings.layersUrl.indexOf(mapUrl))
              {
                name = this.settings.layersName[this.settings.layersUrl.indexOf(mapUrl)];
                recordBaseUrl = this.settings.layersRecordBaseUrl[this.settings.layersUrl.indexOf(mapUrl)];
                recordBaseUri = this.settings.layersRecordBaseUri[this.settings.layersUrl.indexOf(mapUrl)];
                recordDataset = this.settings.layersDataset[this.settings.layersUrl.indexOf(mapUrl)];
              }
              else
              {
                /** create a name from the map file URL */
                var end = mapUrl.lastIndexOf("/");
                name = mapUrl.substr(end, (mapUrl.length - end) + 1);
                name = name.replace(/[^a-zA-Z0-9]/g, " ");
                name = name.replace(" map", "");
              }
              
              /** Create the layer of features to display on the map */
              var layer:Layer = new Layer(name, mapUrl, {recordBaseUrl: recordBaseUrl, recordBaseUri: recordBaseUri, dataset: recordDataset});
              
              /** set the default rendering styles */
              layer.outline = settings.outlineColor;
              layer.fill = /*settings.fillColor*/ layerColors[iColor];
              layer.fillSelected = settings.fillHoverCorlor;
              layer.selectable = settings.selectable;
              layer.tooltip = settings.tooltip;
              
              iColor++;
              
              /** Add the related layers first so that we have the target gisMap layer on top */
              if(targetAttribute != namespaces.getNamespace(this.settings.gisMapAttribute) && 
                 targetAttribute != this.settings.gisMapAttribute)
              {
                this.map.addLayer(layer);
              }
              else
              {
                gisMap = layer;
              }
            }
          }
        }
      }
      
      /** Add the main gisMap layer on top of all related layers */
      if(gisMap)
      {
        this.map.addLayer(gisMap);
      }
      
      /** Setup the color pallet */
      if(this.map.layers.length > 1)
      {
        this.layerColors = settings.layerColors.reverse();
      }
      else
      {
        this.layerColors = settings.layerColors;
      }
      
      /** finally add the map to the application, attaching to stage triggers data loading */
      this.addChild(map);
    }

    /**
     * Process data once the map is ready. 
     * @param event
     * 
     */
    public function mapReadyHandler(event:MapEvent):void
    {
      _initialized = true;

      initialWidth = this.width;
      initialHeight = this.height;

      refreshMap();
      
      if(ExternalInterface.available)
      {
        ExternalInterface.call("mapInitialized");
      }          
      
      this.map.removeEventListener(MapEvent.READY, mapReadyHandler);
    }

    /** Refresh the map if it gets invalidated. */
    private function refreshMap():void
    {
      var iColor:uint = 0;
      
      /** reset the layer */
      for each(var layer:Layer in this.map.layers)
      {
        for each(var feature:Feature in layer.features)
        {
          feature.fill = layerColors[iColor];
          feature.tooltipText = "";
          feature.recordBaseUrl = "";
          feature.recordBaseUri = "";
          feature.dataset = "";
        }
        
        iColor++;
        
        /** Namespaces definition of the application */
        var namespaces:Namespaces = new Namespaces();
  
        /** iterate the features and match the data to the features */
        for each(var feature:Feature in layer.features)
        {
          for each(var subject:Subject in this._semanticDataProvider.subjects)
          {
            var pattern:RegExp = /[^A-Za-z0-1]*/g;
  
            if(feature.exturi && layer.configData.recordBaseUri)
            {
              if((layer.configData.recordBaseUri + feature.exturi) == subject.uri)
              {
                feature.alpha = 1;
    
                /** make fill red */
                feature.fill = settings.fillSelectedColor;
              }
            }
          }

          /** generate tooltip text */
          feature.tooltipText = String(feature.data.preflabel).replace(/(\t|\n|\s{2,})/g, '');
  
          /** set the record base url */
          feature.recordBaseUrl = layer.configData.recordBaseUrl;
          
          /** set the record base uri */
          feature.recordBaseUri = layer.configData.recordBaseUri;
          
          /** set the record dataset */
          feature.dataset = layer.configData.dataset;
        }
  
        /** re-draw the layer with the the data */
        layer.draw();
      }

      this.fitToCanvas();
    }

    /** Fit the screen to the canvas it belongs to */
    public function fitToCanvas():void
    {        
      /** Scale */
      var ratio:Number = 1;
      if(initialWidth > initialHeight)
      {
        ratio = initialHeight / initialWidth;

        if(this.parent.parent.height > this.parent.parent.width)
        {
          this.width = this.parent.parent.width * ratio;
          this.height = this.parent.parent.width;
        }
        else
        {
          this.width = this.parent.parent.height;
          this.height = this.parent.parent.height * ratio;
        }
      }
      else
      {
        ratio = initialWidth / initialHeight;

        if(this.parent.parent.height > this.parent.parent.width)
        {
          this.width = this.parent.parent.width * ratio;
          this.height = this.parent.parent.width;
        }
        else
        {
          this.width = this.parent.parent.height * ratio;
          this.height = this.parent.parent.height;
        }
      }
      
      if(this.settings.displayMapLayersSelector == true)
      {
        this.height -= 20;
      }

      /** Center */
      
      /** 
       * Check the size of the initial control for which the map got centered.
       * Then check the offset between this initial control size, and the
       * size of the current parent control.
       */
      
      /** Get the size of the square */
      
      var squareSize:Number = 0;
      var widthOffset:Number = 0;
      var heightOffset:Number = 0;
      
      if(this.parent.parent.width >= this.parent.parent.height)
      {
        squareSize = this.parent.parent.height;
        
        widthOffset = (this.parent.parent.width - this.parent.parent.height) / 2;
      }
      else
      {
        squareSize = this.parent.parent.width;
        
        heightOffset = (this.parent.parent.height - this.parent.parent.width) / 2;
      }
      
      
      this.x = (this.settings.initialLeft * (squareSize / this.settings.initialWidth)) + widthOffset;
      this.y = (this.settings.initialTop * (squareSize / this.settings.initialHeight)) + heightOffset;

      /** Reset the scale of the map in case that the width/height change modified the scale of the map */
    }
  }
}