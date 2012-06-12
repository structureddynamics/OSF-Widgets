package settings
{
  import com.sd.semantic.settings.Settings;

  /**
   * Workbench initialization settings.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class WorkbenchSettings extends Settings
  {
    public var requiredSettings:Array = new Array("structWSFBaseURL");
    public var error:Boolean = false;

    /** structWSF instance base URL */
    public var structWSFBaseURL:String = "";

    /** behavior of the browser when the user click on a story or wikipedia link */
    public var navigatorBehavior:String = "_blank";

    /** Sticky records used for comparison purposes in the workbench */
    public var stickyRecords:Array /* of records String URI */ = [];

    /** Base URL (with ending slash) where the session server scripts are located */
    public var dashboardSessionsServerBaseUrl:String = "";

    /** 
     * URI of the properties that can be used to aggregate multiple records'
     * properties according to a specific property that acts as an aggregation
     * property. Let's take that example. We have three records defined that way:
     * 
     * <a-2005> a census:Census ;
     *          census:year "2005";
     *          foo:activePopulation "20000".
     * 
     * <a-2006> a census:Censes ;
     *          census:year "2006";
     *          foo:activePopulation "19500".
     *  
     * <a-2007> a census:Censes ;
     *          census:year "2007";
     *          foo:activePopulation "21000".
     * 
     * If the "globalAggregationProperty" is "census:year", then the value of
     * "census:year" will be used to aggregate the value of the property "foo:activePopulation"
     * in the sLinearChart based on the census year of the record.
     * 
     * This property is the same as defined in other semantic components such as the sLinearChart.
     * The same values have to be defined in each. These globalAggregationProperties become 
     * the x-axis of the sLinearChart.
     * 
     * All the properties definin a record, which have a sco:allowedValue of "Float" or "Integer"
     * can be used to get aggregated on a sLinearChart if one of the globalAggregationProperties
     * is also describing them.
     * 
     **/
    public var globalAggregationProperties:Array = new Array();

    /** Array of type URIs used as starting filters to load in the filter control */
    // public var filterTypes:Array /* of String URIs */ = [];

    /** Array of attribute URIs used as starting filters to load in the filter control */
    // public var filterAttributes:Array /* of String URIs */ = [];

    /** Array of datasets URIs used as starting filters to load in the filter control */
    public var filterDatasets:Array /* of String URIs */ = [];

    /**
     * Create a new setting object by reading an input XML settings file
     *  
     * @param xml Input XML settings file where all XML elements have exactly the same name as the public
     *            members of this class.
     * 
     */
    public function WorkbenchSettings(xml:XML)
    {
      super(xml);
    }
  }
}