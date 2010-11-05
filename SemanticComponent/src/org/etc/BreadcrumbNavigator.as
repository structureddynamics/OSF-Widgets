
/** Come from: https://www.assembla.com/code/proFx3BookCode/subversion/nodes/trunk/Chapter_16_Custom_ActionScript_Components/src/components/BreadcrumbNavigator.as */

package org.etc
{
  import flash.display.DisplayObject;
  import flash.events.MouseEvent;
  
  import mx.collections.ArrayCollection;
  import mx.core.UIComponent;
  import mx.effects.Move;
  import mx.effects.Sequence;
  import mx.events.CollectionEvent;
  import mx.events.EffectEvent;
  import mx.events.ItemClickEvent;
  
  /**
   * itemClick - This event is dispatched when a Breadcrumb has been selected. The event's item property
   * is the data associated with the Breadcrumb selected.
   */
  [Event(name="itemClick",type="mx.events.ItemClickEvent")]
  
  /**
   * color - styles the color of the labels.
   */
  [Style(name="color",type="Number",format="Color",inherit="yes")]
  
  /**
   * borderColor - styles the edges of the Breadcrumbs.
   */
  [Style(name="borderColor",type="Number",format="Color")]
  
  /**
   * backgroundFillColors - an Array of two colors used to fill the Breadcrumbs' backgrounds. The
   * first value is the top color, the second is the bottom color.
   */
  [Style(name="backgroundFillColors",type="Array")]
  
  /**
   * BreadcrumbNavigator
   * 
   * This control presents a series of navigation controls called "bread crumbs" which track
   * the places a user has been in the application. Each crumb is a Breadcrumb control. Clicking
   * on a crumb causes the BreadcrumbNavigator to a) dispatch an ItemClick event and b) remove
   * the crumbs to the right of the one selected.
   * 
   * Another thing you can do: Add the ability to give each Breadcrumb an icon. In other controls
   * this is done with an iconField, similar to the labelField, which indicates which field of
   * a data item contains the name of the icon to display. The Breadcrumb class needs to be
   * changed to allow for an icon property and to display the image.
   * 
   * Another thing you can do: Hook up the history and/or deep linking components to make this
   * a true navigator.
   */
  
  public class BreadcrumbNavigator extends UIComponent
  {
    public function BreadcrumbNavigator()
    {
      super();
    }
    
    private var rawChildren:Array;
    
    /**
     * dataProvider - the collection used to build the breadcrumbs. Each member of the
     * collection represents one crumb. The labelField of the item becomes the label of
     * the crumb. The first item in the collection is placed on the far left, the last item
     * is on the far right.
     * 
     * All Flex controls which use a list of data call the property "dataProvider" and it
     * important to be consistent with the Framework. It makes your control appear professional
     * and it makes it easier to use your control when it is consistent with others.
     */
    private var _dataProvider:ArrayCollection;
    public function get dataProvider() : ArrayCollection
    {
      return _dataProvider;
    }
    public function set dataProvider( value:ArrayCollection ) : void
    {
      _dataProvider = value;
      
      // listen for changes in the collection so the crumbs can be re-generated.
      _dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, handleCollectionChange);
      
      // when the collection is explicitly changed like this, flagging the properties as 
      // changed causes commitProperties to be called and generates a new set of Breadcrumbs.
      invalidateProperties();
    }
    
    /**
     * labelField - this property names the field within each element of the dataProvider that
     * supplies the value for the label on the Breadcrumb.
     */
    private var _labelField:String = "label";
    public function get labelField() : String
    {
      return _labelField;
    }
    public function set labelField( value:String ) : void
    {
      _labelField = value;
      invalidateProperties();
    }
    
    /**
     * createChildren - Flex Framework override
     */
    override protected function createChildren() : void
    {
      super.createChildren();
      
      // All of the Breadcrumbs are created in commitProperties. That's because at this point in the
      // Flex Framework life cycle the dataProvider property may not have been set and so you 
      // cannot create the Breadcrumbs. Plus, the dataProvider can change at any time and createChildren
      // is called only once.
      
      rawChildren = new Array();
    }
    
    /**
     * commitProperties - Flex Framework override
     * 
     * This function is called after createChildren and all of the properties have been set. You can now
     * apply properties to any children created. In the component, createChildren could not create
     * the Breadcrumbs, so they are created here.
     */
    override protected function commitProperties() : void
    {
      super.commitProperties();
      
      // Remove any previously created Breadcrumb buttons
      
      var n:int = rawChildren.length;
      
      for(var i:int=0; i < n; i++)
      {
        var c:DisplayObject = rawChildren.pop() as DisplayObject;
        removeChild( c );
      }
      
      // Create the breadcrumb buttons from the data provider
      
      if( dataProvider )
      {       
        n = dataProvider.length;
        
        for(i=0; i < n; i++)
        {
          var item:Object = dataProvider.getItemAt(i);
          
          // Create a new instance of a Breadcrumb, assigning it the same style
          // as this component so styles may easily be transferred. Use the
          // labelField property to assign the Breadcrumb label and determine
          // which Breadcrumb is the final one.
          var crumb:Breadcrumb = new Breadcrumb();
          crumb.styleName = this;
          crumb.label = item[labelField];
          crumb.firstCrumb = i == 0;
          
          // add the Breadcrumb as a child of this component and set up a listener for the
          // click event. The crumb is always made the lowest one so that the crumbs appear
          // on top of each other from left to right.
          addChildAt(crumb,0); 
          crumb.addEventListener(MouseEvent.CLICK, handleMouseEvent);
          
          // Keep a reference to this Breadcrumb in the rawChildren array so it
          // can easily be accessed later.
          rawChildren.push(crumb);
        }
      }
    }
    
    /**
     * measure - Flex Framework Override
     * The function determines the ideal size of the component and sets the measuredWidth and
     * measuredHeight properties.
     */
    override protected function measure():void
    {
      var n:int = numChildren;
      var mW:Number = 0;
      var mH:Number = 0;
      
      // The width is the sum of the widths of the Breadcrumbs while the height is the
      // maximum height of the crumbs (they should all be the same, of course).
      for(var i:int=0; i < n; i++)
      {
        var crumb:Breadcrumb = getChildAt(i) as Breadcrumb;
        mW += crumb.getExplicitOrMeasuredWidth() - Breadcrumb.ARROW_MARGIN;
        mH = Math.max(mH, crumb.getExplicitOrMeasuredHeight());
      }
      
      // since the first breadcrumb edge is flat and not overlapping another, add back
      // the margin
      mW += Breadcrumb.ARROW_MARGIN;
      
      measuredWidth = mW;
      measuredHeight = mH;
    }
    
    /**
     * updateDisplayList - Flex Framework Override
     * This function positions and sizes the children. The Breadcrumbs are laid end-to-end with
     * a slight overlap.
     */
    override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
    {
      super.updateDisplayList(unscaledWidth,unscaledHeight);
      
      var n:int = numChildren;
      var xpos:Number = 0;
      
      // Size and position each of the Breadcrumbs, overlapping them a little so the
      // arrow is placed within the ARROW_MARGIN of the one underneath.
      
      for(var i:int=n-1; i >= 0; i--)
      {
        var crumb:Breadcrumb = getChildAt(i) as Breadcrumb;
        crumb.move(xpos,0);
        crumb.setActualSize(crumb.getExplicitOrMeasuredWidth(),crumb.getExplicitOrMeasuredHeight());
        
        xpos += crumb.getExplicitOrMeasuredWidth() - Breadcrumb.ARROW_MARGIN;
      }
    }
    
    /**
     * handleCollectionChange
     * This function is invoked whenever the dataProvider dispatches a COLLECTION_CHANGE event. 
     * The invalidProperties() function is called to set up commitProperties() and regenerate the
     * list of Breadcrumbs.
     */
    private function handleCollectionChange( event:CollectionEvent ) : void
    {
      invalidateProperties();
    }
    
    /**
     * 
     */
    private function handleMouseEvent( event:MouseEvent ) : void
    {
      // Determine which Breadcrumb was selected
      
      var n:int = rawChildren.length;
      var eventIndex:int = -1;
      for(var i:int=0; i < n; i++)
      {
        if( event.currentTarget == rawChildren[i] ) {
          eventIndex = i;
          break;
        }
      }

      // Remove the Breadcrumb and all that follow it
      removeBreadcrumbAnimated( eventIndex ); // alternative
      
      // Compose an itemClick event from that information and dispatch it
      var newEvent:ItemClickEvent = new ItemClickEvent( ItemClickEvent.ITEM_CLICK );
      newEvent.index = eventIndex;
      newEvent.item = dataProvider[eventIndex];
      newEvent.label = (event.currentTarget as Breadcrumb).label;
      dispatchEvent( newEvent );
    }
    
    private function removeBreadcrumb( index:int ) : void
    {
      var n:int = rawChildren.length;
      for(var i:int=n-1; i > index; i--)
      {
        dataProvider.removeItemAt(i);
      }
      
    }
    
    /*
    * Animation alternative: when the user clicks on a Breadcrumb, all of the crumbs to its right
    * are hidden by slidding them behind the one to their left.
    */
    
    private var sequenceEffect:Sequence;
    private var releaseIndex:int;
    
    /**
     * removeBreadcrumbAnimated -
     * Begins a sequence of anmimations that make it appear as though the Breadcrumbs are sliding
     * to the left and moving beneath the crumb to the left.
     * 
     * What is actually happening is that at the end of the animation the crumb's visibility is
     * set to false and then, once all of the crumbs have been moved, they are removed from the
     * dataProvider.
     */
    private function removeBreadcrumbAnimated( index:int ) : void
    {
      // The animation of the crumbs is done with a Sequence of Move effects. EFFECT_END
      // handler is used on the Sequence to remove the crumbs from the dataProvider.
      sequenceEffect = new Sequence();
      sequenceEffect.addEventListener(EffectEvent.EFFECT_END, handleEffectEnd);
      
      // remember the index selected so the crumbs to its right can be released.
      releaseIndex = index;
      
      var n:int = rawChildren.length;
      
      // create the Move effects to slide a crumb to the left, stopping when the
      // crumb's right edge reaches its original X position. The list must be built
      // in reverse order so the effects play from right to left.
      for(var i:int=n-1; i > index; i--)
      {
        var crumb:Breadcrumb = rawChildren[i] as Breadcrumb;
        var moveEffect:Move = new Move(crumb);
        moveEffect.addEventListener(EffectEvent.EFFECT_END, handleMoveEnd);
        moveEffect.xFrom = crumb.x;
        moveEffect.xTo = crumb.x - crumb.width;
        moveEffect.duration = 100;
        sequenceEffect.addChild(moveEffect);
      }
      
      sequenceEffect.play();
      
    }
    
    /**
     * handleMoveEnd -
     * Once a Move effect has finished, the crumb's visible property is set to false
     */
    private function handleMoveEnd( event:EffectEvent ) : void
    {
      var m:Move = event.currentTarget as Move;
      (m.target as Breadcrumb).visible = false;
    }
    
    /**
     * handleEffectEnd -
     * Once the Sequence effect has finished, the crumbs are removed from the
     * dataProvider.
     */
    private function handleEffectEnd( event:EffectEvent ) : void
    {
      var n:int = rawChildren.length;
      
      for(var i:int=(n-1); i > releaseIndex; i--)
      {
        dataProvider.removeItemAt(i);
      }
    }
    
  }
}