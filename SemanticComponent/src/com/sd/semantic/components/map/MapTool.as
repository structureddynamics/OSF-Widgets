package com.sd.semantic.components.map
{
  import com.sd.semantic.core.Namespaces;
  import com.sd.semantic.core.Subject;
  import com.sd.semantic.settings.MapSettings;
  import com.sd.semantic.utilities.ColorGenerator;
  import com.sd.semantic.core.Resultset;
  
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
    public var layerColors:Array /* of hex colors */ = [0xFFD2B48C,0xFFBC8F8F,0xFFF4A460,0xFFDAA520,0xFFB8860B,
      0xFFCD853F,0xFFD2691E,0xFF8B4513,0xFFA0522D,0xFFA52A2A,0xFF800000,0xFFCD5C5C,0xFFF08080,0xFFFA8072,0xFFE9967A,
      0xFFFFA07A,0xFFDC143C,0xFFFF0000,0xFFB22222,0xFF8B0000,0xFFFFB6C1,0xFFFF69B4,0xFFFF1493,0xFFC71585,0xFFDB7093,
      0xFFFFA07A,0xFFFF7F50,0xFFFF6347,0xFFFF4500,0xFFFF8C00,0xFFFFD700,0xFFFFFF00,0xFFD8BFD8,0xFFDDA0DD,0xFFEE82EE,
      0xFFDA70D6,0xFFFF00FF,0xFFBA55D3,0xFF9370DB,0xFF9966CC,0xFF8A2BE2,0xFF800080,0xFF4B0082,0xFF6A5ACD,0xFF483D8B,
      0xFFADFF2F,0xFF7FFF00,0xFF00FF00,0xFF32CD32,0xFF98FB98,0xFF00FA9A,0xFF00FF7F,0xFF3CB371,0xFF2E8B57,0xFF228B22,
      0xFF006400,0xFF9ACD32,0xFF6B8E23,0xFF808000,0xFF556B2F,0xFF66CDAA,0xFF8FBC8F,0xFF20B2AA,0xFF008B8B,0xFF00FFFF,
      0xFFAFEEEE,0xFF7FFFD4,0xFF40E0D0,0xFF5F9EA0,0xFF4682B4,0xFFB0C4DE,0xFFB0E0E6,0xFF87CEFA,0xFF00BFFF,0xFF1E90FF,
      0xFF6495ED,0xFF7B68EE,0xFF4169E1,0xFF0000FF];
    
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
      this.map.x += this.settings.initialLeft;
      this.map.y += this.settings.initialTop;      
      
      /** listen for map ready event to process/visualize data */
      this.map.addEventListener(MapEvent.READY, mapReadyHandler);

      /** URL of the map to load in this component. */
      var mapUrl:String = "";

      /** Namespaces definition of the application */
      var namespaces:Namespaces = new Namespaces();
      
      /** Map GIS map to be displayed for that record */
      var gisMap:Layer;
      
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
              
              /** create a name from the map file URL */
              end = mapUrl.lastIndexOf("/");
              var name:String = mapUrl.substr(end, (mapUrl.length - end) + 1);
              name = name.replace(/[^a-zA-Z0-9]/g, " ");
              name = name.replace(" map", "");
              
              /** Create the layer of features to display on the map */
              var layer:Layer = new Layer(name, mapUrl);
              
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
  
            if(feature.exturi && settings.recordBaseUri)
            {
              if((settings.recordBaseUri + feature.exturi) == subject.uri)
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
          feature.recordBaseUrl = settings.recordBaseUrl;
  
          /** set the record base uri */
          feature.recordBaseUri = settings.recordBaseUri;
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
      if(initialWidth > initialHeight)
      {
        var ratio:Number = initialHeight / initialWidth;

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
        var ratio:Number = initialWidth / initialHeight;

        if(this.parent.parent.height > this.parent.parent.width)
        {
          this.width = this.parent.parent.width;
          this.height = this.parent.parent.width * ratio;
        }
        else
        {
          this.width = this.parent.parent.height * ratio;
          this.height = this.parent.parent.height;
        }
      }

      /** Center */

      /** Center on the X axis */
      if(this.settings.initialLeft <= 0)
      {
        this.x = (this.parent.parent.width / 2) - (this.width / 2);
      }
      else
      {
        this.x = this.settings.initialLeft;        
      }

      
      /** Center on the Y axis */
      if(this.settings.initialTop <= 0)
      {
        this.y = (this.parent.parent.height / 2) - (this.height / 2);
      }
      else
      {
        this.y = this.settings.initialTop; 
      }
      
      /** Reset the scale of the map in case that the width/height change modified the scale of the map */
//    this.scaleX = 1;
//    this.scaleY = 1;
    }
  }
}