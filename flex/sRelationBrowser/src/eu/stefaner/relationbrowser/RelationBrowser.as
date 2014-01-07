package eu.stefaner.relationbrowser
{
  import com.sd.semantic.settings.RelationBrowserSettings;
  
  import eu.stefaner.relationbrowser.data.AtomicNode;
  import eu.stefaner.relationbrowser.data.NodeData;
  import eu.stefaner.relationbrowser.layout.RadialLayout;
  import eu.stefaner.relationbrowser.layout.VisibilityFilter;
  import eu.stefaner.relationbrowser.ui.Edge;
  import eu.stefaner.relationbrowser.ui.Node;

  import flare.analytics.cluster.CommunityStructure;
  import flare.analytics.cluster.HierarchicalCluster;
  import flare.animate.TransitionEvent;
  import flare.animate.Transitioner;
  import flare.physics.Simulation;
  import flare.util.Property;
  import flare.util.Vectors;
  import flare.vis.Visualization;
  import flare.vis.controls.ClickControl;
  import flare.vis.controls.HoverControl;
  import flare.vis.data.Data;
  import flare.vis.data.DataList;
  import flare.vis.data.EdgeSprite;
  import flare.vis.events.SelectionEvent;
  import flare.vis.operator.Operator;
  
  import flash.events.Event;
  import flash.net.URLRequest;
  import flash.net.navigateToURL;
  import flash.utils.Dictionary; 
  import mx.controls.Alert;

  public class RelationBrowser extends Visualization
  {

    //--------------------------------------
    // CONSTRUCTOR
    //--------------------------------------
    public var selectedNode:Node;
    private var _depth:uint = 2;
    public var layout:RadialLayout;
    public var visibilityOperator:VisibilityFilter;
    protected var clusterer:HierarchicalCluster;
    protected var transitioner:Transitioner = new Transitioner(1);
    protected var nodesByID:Dictionary = new Dictionary();
    public var visibleNodes:DataList;
    public var visibleEdges:DataList;
    public static const NODE_SELECTED:String = "NODE_SELECTED";
    public static const NODE_SELECTION_FINISHED:String = "NODE_SELECTION_FINISHED";
    public static const NODE_CLICKED:String = "NODE_CLICKED";
    public var showOuterEdges:Boolean = true;
    public var showInterConnections:Boolean = false;
    public var lastClickedNode:Node;
    private var settings:RelationBrowserSettings = null;

    /**
     *@Constructor
     */
    public function RelationBrowser(settings:RelationBrowserSettings)
    {
      this.settings = settings;
      super();
    }

    public function selectNodeByIDExplicitLoad(id:String):void
    {
      this.parent.parent.parent.parent.parent.loadData(id);
    }
    
    
    public function selectNodeByID(id:String):void
    {
      var n:Node = nodesByID[id] as Node;

      if(!n)
      {
        this.parent.parent.parent.parent.parent.loadData(id);
        //throw new Error("could not select node by id: " + id);
      }
      else
      {       
        selectNode(n);
      }
    }

    import flare.vis.operator.layout.*;
    
    protected function initLayout():void
    {
      visibilityOperator = new VisibilityFilter("visibleNodes", [], depth);
      operators.add(visibilityOperator);

      clusterer = new CommunityStructure();
      clusterer.group = "visibleNodes";
      operators.add(clusterer);

      layout = new RadialLayout(sortBy, settings.innerRadius);
      operators.add(layout);
    }

    public var _nodeDefaults:Object;

    public function set nodeDefaults(nodeDefaults:Object):void
    {
      data.nodes.setDefaults(nodeDefaults);
      data.nodes.setProperties(nodeDefaults);
      _nodeDefaults = nodeDefaults;
    }

    public function get nodeDefaults():Object
    {
      return _nodeDefaults;
    }

    private var _edgeDefaults:Object;

    public function set edgeDefaults(edgeDefaults:Object):void
    {
      data.edges.setDefaults(edgeDefaults);
      data.edges.setProperties(edgeDefaults);
      _edgeDefaults = edgeDefaults;
    }

    public function get edgeDefaults():Object
    {
      return _edgeDefaults;
    }

    protected function initControls():void
    {
      controls.add(new ClickControl(Node, 1, onNodeClick));
      controls.add(new HoverControl(Node, HoverControl.MOVE_AND_RETURN, onNodeRollOver, onNodeRollOut));
    }

    public function addOperator(o:Operator):void
    {
      operators.add(o);
    }

    public function addOperators(a:Vector.<Operator>):void
    {
      for each(var i:Operator in a)
      {
        addOperator(i);
      }
    }

    protected function onNodeClick(e:SelectionEvent):void
    {
      trace("click " + e.node);
      var n:Node = e.node as Node;

      if(n != null)
      {
        var anode:AtomicNode = this.parent.parent.parent.parent.parent.skinsManager.getAtomicNodeByType(n.data.id);
        
        if(anode.actionClickGoto != "")
        {
          navigateToURL(new URLRequest(anode.actionClickGoto), settings.navigatorBehavior);
        }
        else
        {
          n.onClick();
          lastClickedNode = n;
          dispatchEvent(new Event(NODE_CLICKED));
          if(n.data.skin.selectable)
          {
            selectNode(n);
          }
        }
      }
    }

    protected function onNodeRollOver(e:SelectionEvent):void
    {
      trace("over " + e.cause.target);
      var n:Node = e.node as Node;

      if(n != null)
      {
        n.onRollOver();
      }
    }

    protected function onNodeRollOut(e:SelectionEvent):void
    {
      trace("out " + e.node);
      var n:Node = e.node as Node;

      if(n != null)
      {
        n.onRollOut();
      }
    }

    public function selectNode(n:Node):void
    {
      if(n == selectedNode)
      {
        return;
      }

      if(selectedNode != null)
      {
        selectedNode.selected = false;
      }

      if(n != null)
      {
        n.selected = true;
      }
      else
      {
      }
      
      selectedNode = n;
      
      updateDisplay();
      
      dispatchEvent(new Event(NODE_SELECTED));
    }

    public function updateDisplay():void
    {
      updateSelection(new Transitioner(1));   
    }

    public function updateSelection(t: *= null):Transitioner
    {
      if(t != null)
      {
        transitioner = Transitioner.instance(t);
      }

      if(!transitioner.hasEventListener(TransitionEvent.END))
      {
        transitioner.addEventListener(TransitionEvent.END, onTransitionEnd, false, 0, true);
      }

      if(selectedNode == null)
      {
        // how to handle generally?
        layout.enabled = false;
        clusterer.enabled = false;
        visibilityOperator.enabled = false;
      }
      else
      {
        layout.enabled = true;
        visibilityOperator.enabled = true;
        clusterer.enabled = true;
        layout.layoutRoot = selectedNode;
        visibilityOperator.focusNodes = Vectors.copyFromArray([selectedNode]);
      }

      preUpdate(transitioner);
      update(transitioner);
      postUpdate(transitioner);

      transitioner.play();

      return transitioner;
    }

    private function onTransitionEnd(event:TransitionEvent):void
    {
      dispatchEvent(new Event(NODE_SELECTION_FINISHED));
    }

    protected function preUpdate(t:Transitioner = null):void
    {
      t = Transitioner.instance(t);
    }

    protected function postUpdate(t:Transitioner = null):void
    {
      t = Transitioner.instance(t);
    }

    public function removeNode(node:Node):void
    {
      delete nodesByID[node.data.id];
      
      data.removeNode(node);
    }
    
    public function addNode(o:NodeData):Node
    {
      var n:Node = getNodeByID(o.id);

      if(n == null)
      {
        // no node yet for ID: create node
        n = nodesByID[o.id] = createNode(o);
        data.nodes.applyDefaults(n);

        /** Set default properties for the type of the node */

        Property.$("edgeRadius").setValue(n, n.data.skin.radius + 15);
        Property.$("h").setValue(n, n.data.skin.radius * 2);
        Property.$("w").setValue(n, n.data.skin.radius * 2);
        
        if(n.data.skin.image == "")
        {
          Property.$("fillColor").setValue(n, n.data.skin.fillColor);  /** Add the alpha channel */
          Property.$("lineWidth").setValue(n, n.data.skin.lineWeight);
          Property.$("lineColor").setValue(n, n.data.skin.lineColor);
          Property.$("shape").setValue(n, n.data.skin.shape);     
        }
        
        data.addNode(n);
      }
      else
      {
        // existing node: set new data
        n.data = o;
      }

      return n;
    }

    protected function createNode(data:NodeData):Node
    {
      return new Node(data);
    }

    public function getNodeByID(id:String):Node
    {
      return nodesByID[id];
    }

    public function addEdge(fromID:String, toID:String, d:Object = null):EdgeSprite
    {
      /** make sure the edge doesn't already exists */
      for each(var edge:Edge in data.edges)
      {
        if(fromID == edge.source.data.id &&
          toID == edge.target.data.id &&
          d.type == edge.data.type)
        {  
          return(edge);
        }    
      }      
      
      var node1:Node = getNodeByID(fromID);
      var node2:Node = getNodeByID(toID);
      
      var e:Edge = createEdge(node1, node2, d);

      try
      {
        node1.addOutEdge(e);
        node2.addInEdge(e);
        data.addEdge(e);
        data.edges.applyDefaults(e);
        
        /** Set default properties for the type of the edge */
        Property.$("arrowType").setValue(e, e.data.skin.directedArrowHead);        
        Property.$("lineWidth").setValue(e, e.data.skin.lineWeight);        
        Property.$("lineColor").setValue(e, e.data.skin.lineColor);        
      }
      catch(err:Error)
      {
      }
      return e;
    }

    protected function createEdge(node1:Node, node2:Node, data:Object):Edge
    {
      return new Edge(node1, node2, data);
    }

    public function removeUnconnectedNodes():void
    {
      for each(var n:Node in data.nodes)
      {
        if(n.degree == 0)
        {
          data.removeNode(n);
        }
      }
    }

    public function get depth():uint
    {
      return _depth;
    }

    public function set depth(depth:uint):void
    {
      _depth = depth;

      if(visibilityOperator)
      {
        visibilityOperator.distance = _depth;
      }
    }

    override public function get data():Data
    {
      return super.data ? super.data : data = new Data();
    }

    override public function set data(data:Data):void
    {
      super.data = data;
      visibleNodes = data.addGroup("visibleNodes");
      visibleEdges = data.addGroup("visibleEdges");
      initControls();
      initLayout();
    }

    private var _sortBy:Array;

    public function get sortBy():Array
    {
      return _sortBy;
    }

    public function set sortBy(sortBy:Array):void
    {
      _sortBy = sortBy;

      if(layout && layout is RadialLayout)
      {
        layout.sortBy = sortBy;
        updateDisplay();
      }
      else if(layout)
      {
        updateDisplay();
      }
    }

    public function selectFirstNode():void
    {
      selectNode(data.nodes[0]);
    }

    public function selectNodeByName(name:String):void
    {
      for each(var n:Node in data.nodes)
      {
        if(n.data.label == name)
        {
          selectNode(n);
        }
      }
    }

    public function selectNodeById(id:String):void
    {
      for each(var n:Node in data.nodes)
      {
        if(n.data.id == id)
        {
          selectNode(n);
        }
      }
    }
  }
}