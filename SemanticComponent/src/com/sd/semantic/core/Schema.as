package com.sd.semantic.core
{
  import com.sd.semantic.events.SchemaLoadedEvent;
  
  import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.net.URLLoader;
  import flash.net.URLRequest;
  
  import mx.controls.Alert;

  /**
   * Conceptual structure used to drives all the semantic component. This structure is created from a irXML schema
   * file. It describes all the attributes and types used to describe the subjects of a resultset.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */
  public class Schema extends EventDispatcher
  {
    /** All attributes defined in the schema(s) */
    private var attributes:Array = [];

    /** All types defined in the schema(s) */
    private var types:Array = new Array();


    /**
    * 
    *  types hierarchical structure. Data structure looks like:
    *  
    *    array (
    *      [0] -> type = SchemaType
    *             subTypes = array (
    *              [0] -> type = SchemaType
    *              subTypes = array (
    *                ...
    *              )
    *            )
    *     [1] -> ...
    *   )
    *              
    */
    public var typesStructure:Array = new Array();

    /** Raw irXML schema XML file */
    public var schema:Array = [];

    /** Namespaces structure used to resolve attributes and types identifiers */
    private var namespaces:Namespaces = new Namespaces();

    /** Constructor. */
    public function Schema(schema:Object = null)
    {
      if(schema != null)
      {
        if(schema is XML)
        {
          processSchema(schema);
        }
        
        if(schema is String)
        {
          processSchema(XML(schema));
        }
      }
    }

    /**
     * Load a irXML schema file accessible on the Web.
     * 
     * @param schemaFile URL of the irXML schema file
     * 
     */
    public function loadSchema(schemaFile:String):void
    {
      var xmlLoader:URLLoader = new URLLoader();
      xmlLoader.load(new URLRequest(schemaFile));
      xmlLoader.addEventListener(Event.COMPLETE, processXmlSchemaHandler);
    }

    /**
     * Get an attribute given an attribute prefixed ID
     *  
     * @param attributeID Prefixed ID of the attribute to get (example: foaf_name).
     * @return Returns a SchemaAttribute if the ID is found in the schema. Returns null otherwise.
     */
    public function getAttribute(attributeID:String):SchemaAttribute
    {
      if(!attributes[attributeID])
      {
        if(attributes[namespaces.getVariable(attributeID)])
        {
          attributeID = namespaces.getVariable(attributeID);
        }
      }

      if(attributes[attributeID])
      {
        return (attributes[attributeID]);
      }

      return (null);
    }

    /**
     * Get a type given a type prefixed ID
     * 
     * @param typeID Prefixed ID of the type to get (example: foaf_Person).
     * @return Returns a SchemaType if the ID is found in the schema. Returns null otherwise.
     */
    public function getType(typeID:String):SchemaType
    {
      if(!types[typeID])
      {
        if(types[namespaces.getVariable(typeID)])
        {
          typeID = namespaces.getVariable(typeID);
        }
      }

      if(types[typeID])
      {
        return (types[typeID]);
      }

      return (null);
    }

    /**
     * Get all super types of a given type ID.
     *  
     * @param typeID Prefixed ID of the type to get (example: foaf_Person).
     * @param recursively If this parameter is true, it will recursively browse the type structure
     *        to getall super types of this type. Otherwise, it will only get the immediate super-types.
     * @return An array of all the super-types of the target type ID. 
     */
    public function getSuperTypes(typeID:String, recursively:Boolean = false):Array
    {
      /**
      * Check if the type exists in the structure:
      * (1) in its full form, or
      * (2) in its minimal form
      */
      if(!types[typeID])
      {
        if(types[namespaces.getVariable(typeID)])
        {
          typeID = namespaces.getVariable(typeID);
        }
      }

      /**
      * Get the full list of super types, recurcively.
      */
      if(types[typeID])
      {
        var superTypes:Array = new Array();

        for each(var type:String in types[typeID].superTypes)
        {
          if(types[type])
          {
            /**
            * Check if we crawl the entire schema structure to add all the super-types.
            * Otherwise, we only return the immediate parents
            */
            if(recursively == true)
            {
              /** Get the super types of the super type... */
              var stypes:Array = getSuperTypes(type, true);

              /** Add all super-types of the super-type */
              superTypes = superTypes.concat(stypes);
            }

            /** Add the current super type */
            superTypes.push(types[type]);
          }
        }

        return (superTypes);
      }

      return ([]);
    }
    
    /**
     * Get all super properties of a given attribute ID.
     *  
     * @param attributeID Prefixed ID of the type to get (example: sco_gisMap).
     * @param recursively If this parameter is true, it will recursively browse the type structure
     *        to getall super attributes of this attribute. Otherwise, it will only get the immediate super-attributes.
     * @return An array of all the super-attributes of the target attribute ID. 
     */
    public function getSuperAttributes(attributeID:String, recursively:Boolean = false):Array
    {
      /**
       * Check if the attribute exists in the structure:
       * (1) in its full form, or
       * (2) in its minimal form
       */
      if(!attributes[attributeID])
      {
        if(attributes[namespaces.getVariable(attributeID)])
        {
          attributeID = namespaces.getVariable(attributeID);
        }
      }
      
      /**
       * Get the full list of super attributes, recurcively.
       */
      if(attributes[attributeID])
      {
        var superAttributes:Array = new Array();
        
        for each(var attribute:String in attributes[attributeID].superProperties)
        {
          if(attributes[attribute])
          {
            /**
             * Check if we crawl the entire schema structure to add all the super-attributes.
             * Otherwise, we only return the immediate parents
             */
            if(recursively == true)
            {
              /** Get the super attributes of the super attribute... */
              var sattributes:Array = getSuperAttributes(attributes, true);
              
              /** Add all super-attributes of the super-attribute */
              superAttributes = superAttributes.concat(sattributes);
            }
            
            /** Add the current super attribute */
            superAttributes.push(attributes[attribute]);
          }
        }
        
        return (superAttributes);
      }
      
      return ([]);
    }    

    /**
     * Get all sub-types of a given type ID.
     *  
     * @param typeID Prefixed ID of the type to get (example: foaf_Person).
     * @param recursively If this parameter is true, it will recursively browse the type structure
     *        to get all sub-types of this type. Otherwise, it will only get the immediate sub-types.
     * @return An array of all the sub-types of the target type ID. 
     */
    public function getSubTypes(typeID:String, recursively:Boolean = false):Array
    {
      /**
      * Check if the type exists in the structure:
      * (1) in its full form, or
      * (2) in its minimal form
      */
      if(!types[typeID])
      {
        if(types[namespaces.getVariable(typeID)])
        {
          typeID = namespaces.getVariable(typeID);
        }
      }

      if(types[typeID])
      {
        var subTypes:Array = new Array();

        for each(var type:SchemaType in types)
        {
          if(type.superTypes.indexOf(typeID) != -1)
          {
            /**
            * Check if we crawl the entire schema structure to add all the sub-types.
            * Otherwise, we only return the immediate parents
            */
            if(recursively == true)
            {
              /** Get the sub types of the sub type... */
              var stypes:Array = getSubTypes(type, true);

              /** Add all sub-types of the sub-type */
              subTypes = subTypes.concat(stypes);
            }

            /** Add the current sub type */
            subTypes.push(type);
          }
        }

        return (subTypes);
      }

      return ([]);
    }
    
    /**
     * Get all sub-types of a given type ID.
     *  
     * @param typeID Prefixed ID of the type to get (example: foaf_Person).
     * @param recursively If this parameter is true, it will recursively browse the type structure
     *        to get all sub-types of this type. Otherwise, it will only get the immediate sub-types.
     * @return An array of all the sub-types of the target type ID. 
     */
    public function getSubAttributes(attributeID:String, recursively:Boolean = false):Array
    {
      /**
       * Check if the attribute exists in the structure:
       * (1) in its full form, or
       * (2) in its minimal form
       */
      if(!attributes[attributeID])
      {
        if(attributes[namespaces.getVariable(attributeID)])
        {
          attributeID = namespaces.getVariable(attributeID);
        }
      }
      
      if(attributes[attributeID])
      {
        var subAttributes:Array = new Array();
        
        for each(var attribute:SchemaAttribute in attributes)
        {
          if(attribute.superProperties.indexOf(attributeID) != -1)
          {
            /**
             * Check if we crawl the entire schema structure to add all the sub-attributes.
             * Otherwise, we only return the immediate parents
             */
            if(recursively == true)
            {
              /** Get the sub attributes of the sub attribute... */
              var sattributes:Array = getSubAttributes(attribute, true);
              
              /** Add all sub-attributes of the sub-attribute */
              subAttributes = subAttributes.concat(sattributes);
            }
            
            /** Add the current sub attribute */
            subAttributes.push(attribute);
          }
        }
        
        return (subAttributes);
      }
      
      return ([]);
    }    

    /**
     * Get all attributes that can be compared to a target attribute. Comparable means that their value should be
     * analizable together (semantically comparable).
     *  
     * @param attribute URI of the attribute. Can in its full URI form like "http://foo.com/bar/..." or its internal 
     *                  abbreged form such as "foo_Bar...".
     * @param comparableAttributes All comparable attributes with the target SchemaAttribute
     * @param inference Enable inference on the schema structure to have all possible comparable attributes
     * 
     * @return Returns nothing
     */
    public function getComparableAttributes(attribute:String, comparableAttributes:Array, inference:Boolean = true):void
    {
      /** Schema attribute in the schema */
      var targetAttribute:SchemaAttribute = getAttribute(attribute);

      if(inference == false)
      {
        for each(var compAttribute:String in targetAttribute.comparableWith)
        {
          comparableAttributes.push(getAttribute(compAttribute));
        }

        return;
      }
      else
      {
        for each(var comparableAttribute:String in targetAttribute.comparableWith)
        {
          /** Comparable Schema attribute in the schema */
          var targetComparableAttribute:SchemaAttribute = getAttribute(comparableAttribute);

          if(targetComparableAttribute.comparableWith.length > 0)
          {
            /** get all possible comparable attributes for each of its comparable attribute */
            for each(var attr:String in targetComparableAttribute.comparableWith)
            {
              /** Make sure the attribute is not already in our set of comparable attributes */
              var alreadyIncluded:Boolean = false;

              for each(var a:SchemaAttribute in comparableAttributes)
              {
                if(a.uri == attr)
                {
                  alreadyIncluded = true;
                }
              }

              if(alreadyIncluded == false)
              {
                comparableAttributes.push(this.getAttribute(attr));
                getComparableAttributes(attr, comparableAttributes);
              }
            }
          }
          else
          {
            return;
          }
        }
      }
    }

    /**
     * Parse the irXML schema file once it got downloaded.
     *  
     * @param event Event trigged once the irXML file got downloaded from the remote location.
     */
    private function processXmlSchemaHandler(event:Event):void
    {
      /** Specifies if a parsing or validation occured */
      var isError:Boolean = false;
      
      var schemaXML:XML;
      
      try
      {
        schemaXML = new XML(event.target.data);
      }
      catch(error:Error)
      {
        Alert.show("Error loading an irON Schema");
        isError = true;
      }
      
      if(!isError)
      {     
        processSchema(schemaXML);
      }

      /**
      * Dispatch a "schemaLoaded" event to notice other pieces of the software that the schema(s) have
      * properly been loaded. 
      */
      dispatchEvent(new SchemaLoadedEvent("schemaLoaded"));
      
      this.removeEventListener(Event.COMPLETE, processXmlSchemaHandler);
    }
    
    /**
     * Append one or multiple schemas to the current schema
     *  
     * @param schemaXML The schema to append to the current schema. The schema has to be in its irXML form. 
     *                  Also, you can put as input an array of schemas definition to happen.
     */    
    public function appendSchema(schemaXML:Object):void
    {
      if(schema is Array)
      {
        for each(var s:XML in schemaXML)
        {
          processSchema(s);
        }
      }
      
      if(schema is XML)
      {
        processSchema(schemaXML);
      }
    }
    
    /**
     * Process a irXML schema description to generate the Schema object.
     *  
     * @param schemaXML The schema to append to the current schema. The schema has to be in its irXML form. 
     */        
    private function processSchema(schemaXML:XML):void
    {
      schema.push(schemaXML);
      
      /** Parse the irXML schema file */
      var prefixes:XMLList = schemaXML.prefixList.children();

      /** Parse prefixes */
      for each(var prefix:XML in prefixes)
      {
        this.namespaces.namespaces[prefix.toString()] = prefix.localName() + "_";
      }
      
      /** Parse attributes */
      var attrs:XMLList = schemaXML.attributeList.children();
      
      for each(var attribute:XML in attrs)
      {
        attributes[attribute.localName()] = new SchemaAttribute(attribute, this.namespaces);
      }
      
      var tps:XMLList = schemaXML.typeList.children();
      
      /** Parse types */
      for each(var type:XML in tps)
      {
        types[type.localName()] = new SchemaType(type, namespaces);
      }
      
      /** Create the hierarchical types structure */
      
      /** Step 1: get all types that doesn't have any super types. */
      for each(var t:SchemaType in types)
      {
        if(t.superTypes.length == 0)
        {
          /** Step 2: create each branch of the structure, from top types, recursively */
          typesStructure.push(getSubTypesStructure(t));
        }
      }     
    }

    /**
     * Get a sub-type branch for a given type.
     *  
     * @param type A SchemaType instance from which we want its sub-type branch.
     * @return An array of {type, subTypes} objects. Returns and empty array if no sub-type exists.
     * 
     */
    private function getSubTypesStructure(type:SchemaType):Array /* of {type, subTypes} objects */
    {
      /** All subtypes of the target type */
      var subTypes:Array = [];

      for each(var subType:SchemaType in types)
      {
        if(subType.superTypes.indexOf(type.uri) != -1)
        {
          subTypes = subTypes.concat(getSubTypesStructure(subType));
        }
      }

      /** Complete sub-types branch of the conceptual structure graph */
      var branch:Array = [];

      branch.push({type: type, subTypes:subTypes});

      return (branch);
    }
  }
}