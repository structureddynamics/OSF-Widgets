package com.sd.semantic.core
{
  /**
   * Attribute description  of an irXML schema.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */
  public class SchemaAttribute
  {
    /** 
    * Specifies the minimum number of values that an attribute can refer to. If the minValues is not specified, 
    * no minimal number of values is required. 
    */
    public var minValues:int = - 1;

    /**
     * Specifies the maximum number of values that an attribute can refer to. If 
     * the maxValues is not specified, no maximum number of values is required. 
     */
    public var maxValues:int = - 1;

    /**
     * Specifies if the values of an attribute are ordered or not. Possible values: (1) ordered, (2) unordered. 
     * If they are, the software that manage the dataset as to keep the order of the values for that attribute 
     * in order. By default, the value of the orderedValues attribute is unordered. 
     */
    public var orderedValues:Boolean = false;

    /**
     * The allowedType attribute is used to specify how an attribute can be used used to describe a certain type 
     * of record. If the allowedType for an attribute is "Person", then this means that this attribute can only 
     * be used to describe records with a type "Person".
     * 
     * If the allowedType is not specified for an attribute of the structure schema, we consider that it can 
     * be used to describe any type of record. 
     */
    public var allowedTypes:Array = [];

    /**
     * The allowedValue attribute is used to specify what type of value an attribute can have. If the allowedValue 
     * for an attribute is "String", then this means that the value of the property can only be a string literal. 
     * If the allowedValue  for an attribute is "Document", then this means that the value of this property can 
     * only be a reference to a record of type "Document".
     * 
     * If the allowedValue is not specified for an attribute of the structure schema, we consider that this attribute 
     * can have any value.
     * 
     * Cardinality of values can be introduced with the Array(...) processing keyword. Array(String) means that 
     * the value of that attribute can be an array of a specified value format or type 
     */
    public var allowedPrimitiveValues:Array = [];

    /** See the description of the allowedPrimitiveValues variable */
    public var allowedTypeValues:Array = [];

    /**
     * This attribute states that the parent "parent attribute string" is an equivalent-property-to the 
     * "value attribute string".
     * 
     * If an array of attributes is specified, it means that the parent "parent attribute string" is a 
     * equivalent-property-of the union of all the "value attribute string". 
     */
    public var equivalentProperties:Array = [];

    /**
     * This attribute states that the parent "parent attribute string" is a sub-property-of the 
     * "value attribute string".
     * 
     * If an array of attributes is specified, it means that the parent "parent attribute string" is 
     * a sub-property-of the union of all the "value attribute string". 
     */
    public var superProperties:Array = [];

    /**
     * Identifier of the attribute 
     */
    public var uri:String = "";

    /**
     * 	The prefLabel attribute is used to describe human readable labels for datasets and instance records. 
     *  It is a complement to the separate, alternative labels (altLabel) attribute. prefLabel  by definition 
     * can not be a list or array.  
     */
    public var prefLabel:String = "";
    
    private var _shortLabel:String = "";

    /**
     * 	The short attribute is used to describe short human readable labels for datasets and instance records. 
     */
    public function get shortLabel():String
    {
      if(_shortLabel != "")
      {
        return _shortLabel;
      }
      else
      {
        if(orderingValue != "")
        {
          return orderingValue;
        }
        else
        {
          return "";
        }
      }
    }

    /**
     * @private
     */
    public function set shortLabel(value:String):void
    {
      _shortLabel = value;
    }

    
    /**
     * Often systems can benefit from a reference to a Web page with additional information about an instance record. 
     * The use of the prefURL attribute is also recommended for user interface generation purposes. prefURL by 
     * definition can not be a list or array.
     * 
     * prefURL is a URL reference to a Web page. It is the single URL chosen by the system for rendering a URL for 
     * a given thing within user interfaces. For whatever instance or object you are considering, think of the 
     * assignment to prefURL as representing the "best" human-viewable Web page available for it.
     */
    public var prefURL:String = "";

    /**
     * Exactly the same mindset applies to the use of the description  attribute. Often systems want to have 
     * short descriptions of the instance records they manage. However, instead of wanting to use a label 
     * to refer to an instance record, they want a description of this instance record.  
     */
    public var description:String = "";

    /**
     * Lists all the semantic component controls that can be used to display the value(s) of this attribute. 
     */
    public var displayControls:Array = [];

    /**
    * The value of the orderingValue attribute is used to order the SchemaAttribute a a set of
    * SchemaAttributes. This set of SchemaAttributes is normally created from the set composed
    * of all compatibleWith attributes.
    * 
    * This is normally used to plot, and order, values of different attributes describing a 
    * same record on some visualization component.
    * 
    * @default Default value is null 
    */
    public var orderingValue:String = null;

    /**
     * List of comparable attributes. These comparable attributes have the same allowedValue,
     * and the semantic of the SchemaAttribute that are comparable is the same. Since the kind of 
     * value, and their semantic is the same, they are then considered comparable.
     * 
     * This is normally used to plot values of different attributes describing a same record
     * on some visualization component.
     * 
     * @default Array() 
     */
    public var comparableWith:Array = [];

    /** Namespaces structure used to resolve attributes and types identifiers */
    private var namespaces:Namespaces = new Namespaces();

    /**
     * Parse the irXML portion of a schema describing the attribute 
     * @param attribute irXML XML portion of the schema describing the attribute.
     */
    public function SchemaAttribute(attribute:XML)
    {
      uri = attribute.localName();

      /** Parse minValues */
      if(attribute.hasOwnProperty("minValues"))
      {
        minValues = attribute.minValues;
      }

      /** Parse maxValues */
      if(attribute.hasOwnProperty("maxValues"))
      {
        maxValues = attribute.maxValues;
      }

      /** Parse orderedValues */
      if(attribute.hasOwnProperty("orderedValues"))
      {
        orderedValues = attribute.orderedValues;
      }

      /** Parse prefLabel */
      if(attribute.hasOwnProperty("prefLabel"))
      {
        prefLabel = attribute.prefLabel;
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

      /** Parse shortLabel */
      if(attribute.hasOwnProperty("shortLabel"))
      {
        shortLabel = attribute.shortLabel;
      }     
      
      /** Parse prefURL */
      if(attribute.hasOwnProperty("prefURL"))
      {
        prefURL = attribute.prefURL;
      }

      /** Parse description */
      if(attribute.hasOwnProperty("description"))
      {
        description = attribute.description;
      }

      /** Parse orderingValue */
      if(attribute.hasOwnProperty("orderingValue"))
      {
        orderingValue = attribute.orderingValue;
      }
      else
      {
        orderingValue = prefLabel;
      }

      /** Parse displayControls */
      for each(var displayControl:XML in attribute.elements("displayControl"))
      {
        displayControls.push(namespaces.getVariable(displayControl.toString()));
      }

      /** Parse allowedValue */
      for each(var allowedValue:XML in attribute.elements("allowedValue"))
      {
        if(allowedValue.hasOwnProperty("primitive"))
        {
          allowedPrimitiveValues.push(namespaces.getVariable(allowedValue.primitive.toString()));
        }

        if(allowedValue.hasOwnProperty("type"))
        {
          allowedTypeValues.push(namespaces.getVariable(allowedValue.type.toString()));
        }
      }

      /** Parse allowedType */
      for each(var allowedType:XML in attribute.elements("allowedType"))
      {
        allowedTypes.push(namespaces.getVariable(allowedType.toString()));
      }

      /** Parse super properties */
      for each(var subPropertyOf:XML in attribute.elements("subPropertyOf"))
      {
        superProperties.push(namespaces.getVariable(subPropertyOf.toString()));
      }

      /** Parse comparable attributes */
      for each(var cw:XML in attribute.elements("comparableWith"))
      {
        comparableWith.push(namespaces.getVariable(cw.toString()));
      }

      /** Parse equivalent properties */
      for each(var equivalentPropertyTo:XML in attribute.elements("equivalentPropertyTo"))
      {
        equivalentProperties.push(namespaces.getVariable(equivalentPropertyTo.toString()));
      }
    }
  }
}