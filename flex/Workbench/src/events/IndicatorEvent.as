package events
{
  import flash.events.Event;

  /**
   * Event that notify when something happen to an indicator panel. (mouse over, mouse out, etc).
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class IndicatorEvent extends Event
  {
    /**
     * Constructor
     *  
     * @param type Type of the event
     * @param selectedIndicator Indicator where the event happened
     * @param bubbles Specifies if the event can bubble
     * @param cancelable Specifies if the event is cancelable
     * 
     */
    public function IndicatorEvent(type:String, selectedIndicator:String, bubbles:Boolean = false,
      cancelable:Boolean = false)
    {
      /** Call the constructor of the superclass. */
      super(type, bubbles, cancelable);

      this.selectedIndicator = selectedIndicator;
    }

    /** Event constent indicating that the mouse moved over the indicator */
    public static const INDICATOR_OVER:String = "indicatorOver";

    /** Event constent indicating that the mouse moved out of the indicator */
    public static const INDICATOR_OUT:String = "indicatorOut";

    /** Target selected indicator */
    public var selectedIndicator:String;

    /** Override the inherited clone() method. */
    override public function clone():Event
    {
      return new IndicatorEvent(type, selectedIndicator);
    }
  }
}