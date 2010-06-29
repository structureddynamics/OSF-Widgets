package com.sd.semantic.core
{
  /**
   * Type description  of an irXML schema.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */  
  public class SchemaType
  {
    /** URI of the type */
    public var uri:String = "";
    
    /** Prefered label to use to refer to the type */
    public var prefLabel:String = "";
    
    /** Alternative labels to use to refer to the type */
    public var altLabels:Array = [];
    
    /** Prefered URL reference where to get information about the type on the Web */
    public var prefURL:String = "";
    
    /** Description of the type */
    public var description:String = "";
    
    /** Super-types of the type */
    public var superTypes:Array = [];
    
    /** Equivalent types of to the type */
    public var equivalentTypes:Array = [];
    
    /** Display control(s) used to display information about the type */
    public var displayControls:Array = [];

    /** Namespace references used to resolve references to the type */
    private var namespaces:Namespaces = new Namespaces();

    /**
     * Constructor
     * 
     * @param type Description of the type in XML
     * 
     */
    public function SchemaType(type:XML)
    {
      uri = type.localName();

      /** Parse prefLabel */
      if(type.hasOwnProperty("prefLabel"))
      {
        prefLabel = type.prefLabel;
      }
      else
      {
        /** 
         * If no prefLabel is available, we use the ending of the URI
         * as the preffered label for this attribute
         */
        prefLabel = namespaces.getNamespace(uri);
        
        var end:int = 0;
        
        end = prefLabel.lastIndexOf("#");
        
        if(end == -1)
        {
          end = prefLabel.lastIndexOf("/");
        }
        
        if(end > 0)
        {
          prefLabel = prefLabel.substr(end + 1, (prefLabel.length - end));
          
          prefLabel = prefLabel.replace(/[^a-zA-Z0-9]/g, " ");
        }
      }      

      /** Parse altLabels */
      for each(var altLabel:XML in type.elements("altLabel"))
      {
        altLabels.push(altLabel.toString());

        /** If no prefLabel has been defined, lets use the first altLabel one as the pref label for this type. */
        if(prefLabel == "")
        {
          prefLabel = altLabel.toString();
        }
      }

      /** Parse prefURL */
      if(type.hasOwnProperty("prefURL"))
      {
        prefURL = type.prefURL;
      }

      /** Parse description */
      if(type.hasOwnProperty("description"))
      {
        description = type.description;
      }

      /** Parse subTypeOf */
      for each(var subTypeOf:XML in type.elements("subTypeOf"))
      {
        superTypes.push(namespaces.getVariable(subTypeOf.toString()));
      }

      /** Parse displayControls */
      for each(var displayControl:XML in type.elements("displayControl"))
      {
        displayControls.push(namespaces.getVariable(displayControl.toString()));
      }
    }
  }
}