package
{
  import com.sd.semantic.settings.Settings;
  
  /**
   * sRelationBrowser settings used by the sRelationBrowser semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */  
  public class RelationBrowserSettings extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array("displayRelatedThingsPanel", 
                                                  "displayConceptsInformationPanel",
                                                  "displayRelatedThingsHTML", 
                                                  "displayConceptsInformationHTML");

    /** Specifies if an error occured when parsing the setting file*/
    public var error:Boolean = false;

    /** Display the "related things" panel in the flex component. */
    public var displayRelatedThingsPanel:Boolean = false;

    /** Display the "related things" section in the parent HTML webpage via the JavaScript bridge. */
    public var displayRelatedThingsHTML:Boolean = false;

    /** Display the "concept information" panel in the flex component. */
    public var displayConceptsInformationPanel:Boolean = false;

    /** Display the "concept information" section in the parent HTML webpage via the JavaScript bridge */
    public var displayConceptsInformationHTML:Boolean = false;
    
    /** Display the nodes and edges filters within the parent HTML page that embed the Flex component */
    public var displayFiltersHTML:Boolean = false;
    
    /** Restrict the type of the nodes that can be filtered. If the array is empty, all types will be filterable */
    public var filtersNodeTypes:Array = [];
    
    /** Restrict the type of the edges that can be filtered. If the array is empty, all types will be filterable */
    public var filtersEdgeTypes:Array = [];
    
    /** URI of the property describing the relationship between a concept and a thing */
    public var relatedThingsRelations:Array = [];
    
    /** 
    * URI of the properties for which you want the values of the selected node. The values of each of
    * these properties will be added to an object which will be returned by the JavaScript function
    * nodeAttributesValues(obj) called by the Flex external interface.
    */
    public var nodeAttributesValues:Array = [];
    
    /** Title to display for the "related things panel" */
    public var relatedThingsPanelTitle:String = "";
    
    /** URI of the property defining the label to use to display the name of a related thing */
    public var relatedThingsLabels:Array = [];
    
    /** List of URIs of node types to ignore when getting node data from the graph structure. */
    public var ignoreNodeTypes:Array = [];    
    
    /** List of URIs of node to ignore when getting node data from the graph structure. */
    public var ignoreNodeUris:Array = [];    
    
    /** URI of the dataset where the things records are indexed */
    public var thingsDataset:String = "";
    
    /** Dataset URI where the concepts records to display in the relation browser are indexed */
    public var conceptsDataset:String = "";
    
    /** 
    * A set of attributes to display in the relation browser. If no attributes URI are defined
    * all object property will be displayed in the relation browser.
    */
    public var linkingAttributes:Array = [];
    
    /** structWSF sparql web service endpoint */
    public var sparqlWebServiceEndpoint:String = "";
    
    /** URL of the structView module where the stories can be viewed when clicked by the user */
    public var structViewUrl:String = "";

    /** behavior of the browser when the user click on a story or wikipedia link */
    public var navigatorBehavior:String = "_blank";
    
    /** display the breadcrumb component ina JavaScript breadcrumb component */
    public var displayBreadcrumb:Boolean = true;
    
    /** display the breadcrumb component within the flex component */
    public var displayBreadcrumbHTML:Boolean = false;
    
    /**
     * Width of the rectangle that should normally be used to have the graph in normal size.
     * This size changes depending on the node sizes, number of nodes in the graph, etc.
     */       
    public var fullSizeWidth:int = 600;

    /**
     * Height of the rectangle that should normally be used to have the graph in normal size.
     * This size changes depending on the node sizes, number of nodes in the graph, etc.
     */       
    public var fullSizeHeight:int = 600;    
    
    /** The initial scale to use to display the graph. This scale is took into account the entire life of the browser */
    public var initialScale:Number = 1;
    
    /** Size of the innerRadius of the graph's radial layout. This will impact the "spread" of the graph */
    public var innerRadius:int = 240;
    
    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function RelationBrowserSettings(xml:XML)
    {
      super(xml);
    }
  }
}