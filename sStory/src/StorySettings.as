package
{
  import com.sd.semantic.settings.Settings;
  
  /**
  * sStory settings used by the sStory semantic component.
  *  
  * @author Frederick Giasson, Structured Dynamics LLC.
  */  
  public class StorySettings extends Settings
  {
    /**
     * List of required settings. If a setting is not defined by the user in the setting file, and that
     * it is defined in this list, an error will be reported to the user 
     */
    public var requiredSettings:Array = new Array("displayRelatedStories", "storyTextUriAttr", "storyAnnotatedTextUriAttr", "conceptAnnotationSet", "namedEntitiesAnnotationSet");
    
    /** Specifies if an error occured when parsing the setting file*/
    public var error:Boolean = false;
  
    /** Display the "related stories" section. */
    public var displayRelatedStories:Boolean = false;
  
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
    
    /** URI of the attribute used to link a story record to the file of its text */
    public var storyTextUriAttr:String = "sco_storyTextUri";
    
    /** URI of the attribute used to link a story record to the GATE annotated file of its text */
    public var storyAnnotatedTextUriAttr:String = "sco_storyAnnotatedTextUri";
    
    /** Name of the GATE annotation set used to define all tagged concepts within the text */
    public var conceptAnnotationSet:String = "";
    
    /** Name of the GATE annotation set used to define all tagged named entities within the text */
    public var namedEntitiesAnnotationSet:String = "";
    
    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function StorySettings(xml:XML)
    {
      super(xml);
    }
  }
}