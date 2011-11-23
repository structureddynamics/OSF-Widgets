/*
* Dispatched when the pod layout changes.
*/

package com.esria.samples.dashboard.events
{
import flash.events.Event;

public class LayoutChangeEvent extends Event
{
	public static var UPDATE:String = "update";
	
	public function LayoutChangeEvent(type:String)
	{
		super(type, true, true);
	}
}
}