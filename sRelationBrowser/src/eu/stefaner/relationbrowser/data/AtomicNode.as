package eu.stefaner.relationbrowser.data
{
  public class AtomicNode
  {
    public var uri:String = "";
    public var actionClickGoto:String = "";
    
    public function AtomicNode(uri:String):void
    {
      this.uri = uri;
    }  
  }
}