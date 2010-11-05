/*
* Base class for pod content.
*/

package com.esria.samples.dashboard.view
{
import flash.xml.XMLNode;
import mx.containers.VBox;
import mx.controls.Alert;
import mx.events.FlexEvent;
import mx.rpc.events.FaultEvent;
import mx.rpc.events.ResultEvent;
import mx.rpc.http.HTTPService;
import mx.utils.ObjectProxy;
import mx.events.IndexChangedEvent;

public class PodContentBase extends VBox
{
	[Bindable]
	public var properties:XML; // Properties are from pods.xml.
	
	function PodContentBase()
	{
		super();
		percentWidth = 100;
		percentHeight = 100;
		addEventListener(FlexEvent.CREATION_COMPLETE, onCreationComplete);
	}
	
	private function onCreationComplete(e:FlexEvent):void
	{
		// Load the data source.
		var httpService:HTTPService = new HTTPService();
		httpService.url = properties.@dataSource;
		httpService.resultFormat = "e4x";
		httpService.addEventListener(FaultEvent.FAULT, onFaultHttpService);
		httpService.addEventListener(ResultEvent.RESULT, onResultHttpService);
		httpService.send();
	}
	
	private function onFaultHttpService(e:FaultEvent):void
	{
		Alert.show("Unable to load datasource, " + properties.@dataSource + ".");
	}
	
	// abstract.
	protected function onResultHttpService(e:ResultEvent):void	{}
	
	// Converts XML attributes in an XMLList to an Array.
	protected function xmlListToObjectArray(xmlList:XMLList):Array
	{
		var a:Array = new Array();
		for each(var xml:XML in xmlList)
		{
			var attributes:XMLList = xml.attributes();
			var o:Object = new Object();
			for each (var attribute:XML in attributes)
			{
				var nodeName:String = attribute.name().toString();
				var value:*;
				if (nodeName == "date")
				{
					var date:Date = new Date();
					date.setTime(Number(attribute.toString()));
					value = date;
				}
				else
				{
					value = attribute.toString();
				}
					
				o[nodeName] = value;
			}
			
			a.push(new ObjectProxy(o));
		}
		
		return a;
	}
	
	// Dispatches an event when the ViewStack index changes, which triggers a state save.
	// ViewStacks are only in ChartContent and FormContent.
	protected function dispatchViewStackChange(newIndex:Number):void
	{
		dispatchEvent(new IndexChangedEvent(IndexChangedEvent.CHANGE, true, false, null, -1, newIndex));
	}
}
}