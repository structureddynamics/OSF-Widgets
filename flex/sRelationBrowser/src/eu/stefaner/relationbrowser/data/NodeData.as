﻿package eu.stefaner.relationbrowser.data
{
  import eu.stefaner.relationbrowser.data.NodeSkin;

  public class NodeData
  {
    public var id:String;
    public var label:String;
    public var type:String;
    public var skin:NodeSkin;
    public var props:Object;    

    public function NodeData(id:String, o:Object = null, label:String = null, type:String = null, skin:NodeSkin = null)
    {
      this.id = id;
      
      this.props = o ? o : {
      };
        
      this.label = label ? label : (o.name ? o.name : id);
      this.type = type ? type : (o.type ? o.type : null);
      this.skin = skin ? skin : (o.skin ? o.skin : null);
    }
  }
}