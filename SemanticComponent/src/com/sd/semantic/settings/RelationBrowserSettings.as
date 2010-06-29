package com.sd.semantic.settings
{
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
    public var requiredSettings:Array = new Array("displayRelatedStories", "displayConceptsInformation");

    /** Specifies if an error occured when parsing the setting file*/
    public var error:Boolean = false;

    /** Display the "related stories" section. */
    public var displayRelatedStories:Boolean = false;

    /** Display the "concept information" section. */
    public var displayConceptsInformation:Boolean = false;

    /** URI of the property describing the relationship between a concept and a story */
    public var relatedStoryRelation:String = "";

    /** URI of the property defining the label to use to display the name of a related story */
    public var relatedStoryLabel:String = "";

    /** URI of the dataset where the stories records are indexed */
    public var storiesDataset:String = "";

    /** structWSF sparql web service endpoint */
    public var sparqlWebServiceEndpoint:String = "";

    /** URL of the structView module where the stories can be viewed when clicked by the user */
    public var structViewUrl:String = "";

    /** behavior of the browser when the user click on a story or wikipedia link */
    public var navigatorBehavior:String = "_blank";

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