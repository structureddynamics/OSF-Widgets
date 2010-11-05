package eu.stefaner.relationbrowser.data
{
  public class SkinsManager
  {
    private var nodes:Array = [];
    private var edges:Array = [];
    private var atomicNodes:Array = [];
    
    public function SkinsManager():void
    {
    }
    
    public function addNodeSkin(nodeSkin:NodeSkin):void
    {
      for each(var skin:NodeSkin in nodes)
      {
        if(skin.type == nodeSkin.type)
        {
          return;
        }
      }
      
      nodes.push(nodeSkin);
    }
    
    public function getNodeSkinByType(type:String):NodeSkin
    {
      for each(var skin:NodeSkin in nodes)
      {
        if(skin.type == type)
        {
          return(skin);
        }
      }
      
      /** If no skin is found for this type, we simply return a default one */
      return(new NodeSkin(type, true));
    }
    
    public function addEdgeSkin(edgeSkin:EdgeSkin):void
    {
      for each(var skin:EdgeSkin in edges)
      {
        if(skin.type == edgeSkin.type)
        {
          return;
        }
      }
      
      edges.push(edgeSkin);
    }
    
    public function getEdgeSkinByType(type:String):EdgeSkin
    {
      for each(var skin:EdgeSkin in edges)
      {
        if(skin.type == type)
        {
          return(skin);
        }
      }
      
      /** If no skin is found for this type, we simply return a default one */
      return(new EdgeSkin(type));
    }

    public function addAtomicNode(atomicNode:AtomicNode):void
    {
      for each(var anode:AtomicNode in atomicNodes)
      {
        if(anode.uri == atomicNode.uri)
        {
          return;
        }
      }
      
      atomicNodes.push(atomicNode);
    }
    
    public function getAtomicNodeByType(uri:String):AtomicNode
    {
      for each(var anode:AtomicNode in atomicNodes)
      {
        if(anode.uri == uri)
        {
          return(anode);
        }
      }
      
      /** If no skin is found for this type, we simply return a default one */
      return(new AtomicNode(uri));
    }
    
  }
}