package events
{
  import flash.events.Event;

  public class ItemClickEvent extends Event
  {
    public function ItemClickEvent(type:String, selectedValue:String = "", selectedAttribute:String = "")
    {
      /** Call the constructor of the superclass. */
      super(type);

      this.selectedValue = selectedValue;
      this.selectedAttribute = selectedAttribute;
    }

    /** Define static constant. */
    public static const ITEM_CLICK:String = "itemClick";

    /** Define a public variable to hold the state of the enable property. */
    public var selectedValue:String;
    public var selectedAttribute:String;

    /** Override the inherited clone() method. */
    override public function clone():Event
    {
      return new ItemClickEvent(type, selectedValue, selectedAttribute);
    }
  }
}