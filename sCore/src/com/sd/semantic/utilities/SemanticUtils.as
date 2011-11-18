package com.sd.semantic.utilities
{
  /**
   * Series of utilities function that can be used by any Semantic Component class, defined as static functions.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */
  public class SemanticUtils
  {
    /**
     * Get all children of a given element of a component layout (recursively).
     *  
     * @param immediateChildren Array of elements for which we want their children
     * @param children List of all children (aggregated recusively) of a target immediateChildren.
     *        This is what is returned by this function.
     */
    public static function getChildrenRecur(immediateChildren:Array, children:Array):void
    {
      if(immediateChildren.length == 0)
      {
        return;
      }

      for(var i:int = 0; i < immediateChildren.length; i++)
      {
        /** Add the immediate child */
        children.push(immediateChildren[i]);

        /** Add the children of the immediate child */
        if(immediateChildren[i].hasOwnProperty("getChildren"))
        {
          getChildrenRecur(immediateChildren[i].getChildren(), children);
        }
      }
    }

    /**
     * Get the list of all attributes bound to specific semantic controls in an application layout.
     * 
     * Note: this function is normally used with the getChildrenRecur function to get all these bount
     * attributes.
     *  
     * @param children List of components for which we want to know if they are bound to any attribute.
     * @return Returns a list of attribute URI bound to different components.
     */
    public static function getBoundAttributes(children:Array):Array
    {
      var boundAttributes:Array = new Array();

      for(var i:int = 0; i < children.length; i++)
      {
        if(children[i].hasOwnProperty("boundAttributes"))
        {
          for(var ii:int = 0; ii < children[i].boundAttributes.length; ii++)
          {
            boundAttributes.push(children[i].boundAttributes[ii]);
          }
        }
      }

      return (boundAttributes);
    }

    /**
     * Get a reference on a component by its ID. This is normally used to get a reference on any component of a layout
     * which as a ID.
     *  
     * @param id ID of the component to get
     * @param parent A reference to the parent component from which we want to search for the child component. It can
     *        be a reference to the main Application object, or any other child component.
     * @return 
     * 
     */
    public static function getChildById(id:String, parent:Object):Object
    {
      if(parent && parent.hasOwnProperty("getChildren"))
      {
        for each(var item:Object in parent.getChildren())
        {
          if(item.id == id)
          {
            return (item);
          }

          if(item.numChildren > 0)
          {
            var obj:Object = getChildById(id, item);

            if(obj != null)
            {
              return (obj);
            }
          }
        }
      }

      return (null);
    }
  }
}