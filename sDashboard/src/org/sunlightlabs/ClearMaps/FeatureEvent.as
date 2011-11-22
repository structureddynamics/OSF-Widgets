package org.sunlightlabs.ClearMaps
{
  import flash.events.Event;

  public class FeatureEvent extends Event
  {
    /** @patch Frederick Giasson, Structured Dynamics LLC. -- 3 May 2010 */
    public static const FEATURE_SELECTED:String = "featureSelected";
    public static const FEATURE_OVER:String = "featureOver";
    public static const FEATURE_OUT:String = "featureOut";

    public var feature:Feature;

    public function FeatureEvent(type:String, f:Feature, bubbles:Boolean = false, cancelable:Boolean = false)
    {
      super(type, bubbles, cancelable);

      this.feature = f;
    }
  }
}
