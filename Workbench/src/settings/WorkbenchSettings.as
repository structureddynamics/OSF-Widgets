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