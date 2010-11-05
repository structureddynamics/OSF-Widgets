package com.sd.semantic.core
{
  import com.sd.semantic.core.Namespaces;

  /**
   * Description of a subject which is part of a structXML resultset. These are the core items manipulated
   * by any semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */
  public class Subject
  {
    /** List of attributes used to describe the subject. */
    public var predicates:Array = [];

    /** First type of the subject. */
    public var type:String = "";

    /** URI identifier of the subject */
    public var uri:String = "";

    /** Prefixes -- URI associative list used to resolve the prefixed ID into their full URI */
    private var prefixes:Array = [];

    /** Namespaces structure used to resolve attributes and types identifiers */
    private var namespaces:Namespaces = new Namespaces();

    /**
     * Parse the <subject /> tag of the structXML input resultset XML file.
     *  
     * @param preds All predicates, serialized in structXML, within the <subject /> XML tag.
     * @param prefixes Prefixes -- URI associative list used to resolve the prefixed ID into their full URI 
     * 
     */
    public function Subject(preds:XML, prefixes:Array):void
    {
      this.prefixes = prefixes;

      /** Get the type of the subject */
      if(preds.@type)
      {
        type = resolvePrefix(preds.@type);
      }

      /** Get the URI of the subject */
      if(preds.@uri)
      {
        uri = resolvePrefix(preds.@uri);

        if(uri == "")
        {
          throw new ResultsetParsingError("Expected URI for a subject of a resultset");
        }
      }
      else
      {
        throw new ResultsetParsingError("Expected URI for a subject of a resultset");
      }

      /** parse predicates */
      for each(var predicate:XML in preds.predicate)
      {
        if(predicate.@type)
        {
          /** URI of the predicate describing the subject */
          var predicateType:String = namespaces.getVariable(XMLList(resolvePrefix(predicate.@type)).toString());

          if(predicates[predicateType] == undefined)
          {
            predicates[predicateType] = [];
          }

          /** Object values referenced by the predicates */
          var object:Array = [];

          /** Get the type of the object of the predicate */
          if(predicate.object.@type)
          {
            object["type"] = namespaces.getVariable(XMLList(resolvePrefix(predicate.object.@type)).toString());
          }
          else
          {
            object["type"] = "rdfs_Resource";
          }

          /** Get the URI of the object of the predicate */
          if(predicate.object.@uri)
          {
            object["uri"] = XMLList(resolvePrefix(predicate.object.@uri)).toString();
          }
          else
          {
            object["uri"] = "";
          }

          /** Get object value */

          /** check if there is a reification statement for this object */
          var reify:Array = new Array();

          if(predicate.object.hasOwnProperty("reify"))
          {
            if(object["reify"] == undefined)
            {
              object["reify"] = new Array();
            }

            /** Check reification type */
            if(predicate.object.reify.@type)
            {
              reify["type"] = namespaces.getVariable(XMLList(resolvePrefix(predicate.object.reify.@type)).toString());
            }
            else
            {
              throw new ResultsetParsingError("Expected type attribute for a reification statement");
            }

            /** Check reification value */
            if(predicate.object.reify.@value)
            {
              reify["value"] = XMLList(predicate.object.reify.@value).toString();
            }

            object["reify"].push(reify);
          }
          else
          {
            /** Set value for the object */
            object["value"] = XMLList(predicate.object).toString()
          }

          predicates[predicateType].push(object);
          predicates.length++;
        }
        else
        {
          throw new ResultsetParsingError("Expected type attribute for the predicate");
        }
      }
    }

    /**
     * Get the values for an attribute of the subject.
     *  
     * @param uri URI of the attribute for which we want the values.
     * @return  An array of values. An empty array if no values are defined for this attribute.
     */
    public function getPredicateValues(uri:String):Array
    {
      for(var predicate:String in predicates)
      {
        if(predicate == uri || predicate == namespaces.getVariable(uri) || predicate == namespaces.getNamespace(uri))
        {
          return (predicates[predicate]);
        }
      }

      return ([]);
    }

    /**
     * Get the preffered label for the subject.
     * 
     * Note: this function is influenced by the <prefLabelAttributes /> setting of the General.xml setting file.
     *   
     * @param prefLabelAttributes
     * @return 
     */
    public function getPrefLabel(prefLabelAttributes:Array = null):String
    {
      if(prefLabelAttributes == null)
      {
        /** by default, there is at least one such attribute: iron:prefLabel */
        prefLabelAttributes = new Array("http://purl.org/ontology/iron#prefLabel");
      }

      for each(var prefLabelAttribute:String in prefLabelAttributes)
      {
        if((predicates[prefLabelAttribute] && predicates[prefLabelAttribute].length > 0))
        {
          return (predicates[prefLabelAttribute][0]["value"]);
        }

        if((predicates[namespaces.getVariable(prefLabelAttribute)]
          && predicates[namespaces.getVariable(prefLabelAttribute)].length > 0))
        {
          var test:String = namespaces.getVariable(prefLabelAttribute);
          return (predicates[namespaces.getVariable(prefLabelAttribute)][0]["value"]);
        }

        if((predicates[namespaces.getNamespace(prefLabelAttribute)]
          && predicates[namespaces.getNamespace(prefLabelAttribute)].length > 0))
        {
          return (predicates[namespaces.getNamespace(prefLabelAttribute)][0]["value"]);
        }
      }

      return ("");
    }

    /**
     * Get the preffered URLs for the subject.
     * 
     * Note: this function is influenced by the <prefLabelAttributes /> setting of the General.xml setting file.
     *   
     * @param prefLabelAttributes
     * @return 
     */
    public function getPrefURL(prefURLAttributes:Array = null):String
    {
      if(prefURLAttributes == null)
      {
        /** by default, there is at least one such attribute: iron:prefLabel */
        prefURLAttributes = new Array("http://purl.org/ontology/iron#prefURL");
      }
      
      for each(var prefURLAttribute:String in prefURLAttributes)
      {
        if((predicates[prefURLAttribute] && predicates[prefURLAttribute].length > 0))
        {
          return (predicates[prefURLAttribute][0]["value"]);
        }
        
        if((predicates[namespaces.getVariable(prefURLAttribute)]
          && predicates[namespaces.getVariable(prefURLAttribute)].length > 0))
        {
          var test:String = namespaces.getVariable(prefURLAttribute);
          return (predicates[namespaces.getVariable(prefURLAttribute)][0]["value"]);
        }
        
        if((predicates[namespaces.getNamespace(prefURLAttribute)]
          && predicates[namespaces.getNamespace(prefURLAttribute)].length > 0))
        {
          return (predicates[namespaces.getNamespace(prefURLAttribute)][0]["value"]);
        }
      }
      
      return ("");
    }    
    
    /**
     * Get the preffered URLs for the subject.
     * 
     * Note: this function is influenced by the <prefLabelAttributes /> setting of the General.xml setting file.
     *   
     * @param prefLabelAttributes
     * @return 
     */
    public function getDescription(descriptionAttributes:Array = null):String
    {
      if(descriptionAttributes == null)
      {
        /** by default, there is at least one such attribute: iron:prefLabel */
        descriptionAttributes = new Array("http://purl.org/ontology/iron#description",
                                          "http://www.w3.org/2004/02/skos/core#definition",
                                          "http://purl.org/dc/terms/description",
                                          "http://purl.org/dc/elements/1.1/description",
                                          "http://www.w3.org/1999/02/22-rdf-syntax-ns#comment");
      }
      
      for each(var descriptionAttribute:String in descriptionAttributes)
      {
        if((predicates[descriptionAttribute] && predicates[descriptionAttribute].length > 0))
        {
          return (predicates[descriptionAttribute][0]["value"]);
        }
        
        if((predicates[namespaces.getVariable(descriptionAttribute)]
          && predicates[namespaces.getVariable(descriptionAttribute)].length > 0))
        {
          var test:String = namespaces.getVariable(descriptionAttribute);
          return (predicates[namespaces.getVariable(descriptionAttribute)][0]["value"]);
        }
        
        if((predicates[namespaces.getNamespace(descriptionAttribute)]
          && predicates[namespaces.getNamespace(descriptionAttribute)].length > 0))
        {
          return (predicates[namespaces.getNamespace(descriptionAttribute)][0]["value"]);
        }
      }
      
      return ("");
    }        
    
    /**
     * Get the prefixed ID of an attribute or type, from its full URI, given the list of prefixes
     * defined in the input resultset structXML file.
     * 
     * @param uri URI of the attribute or type to get the prefixed ID from.
     * @return The prefixed ID of the full URI. If it can't be resolved, the input URI is returned.
     */
    private function resolvePrefix(uri:String):String
    {
      if(uri.indexOf(":") != -1 && uri.substr(0, 5) != "http:")
      {
        var prefix:String = uri.substr(0, uri.indexOf(":"));

        if(prefixes[prefix])
        {
          uri = prefixes[prefix] + uri.substr(uri.indexOf(":") + 1)
        }
      }

      return (uri);
    }
    
    /**
    * Get the structXML serialization of the Subject.
    * 
    * @param includeResultset Include the resultset wrapper to the serialized Subject.
    *                         If this parameter is true, it means that the user
    *                         want to use it as a resultset with a single subject.
    * @return The structXML serialization of the subject.
    */
    public function getXMLSerialization(includeResultset:Boolean = false):String
    {
      var xml:String = "";
      
      if(includeResultset == true)
      {
        xml += "<resultset>\n";
        

        xml += "  <prefix entity=\"owl\" uri=\"http://www.w3.org/2002/07/owl#\"/>\n";
        xml += "  <prefix entity=\"rdf\" uri=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"/>\n";
        xml += "  <prefix entity=\"rdfs\" uri=\"http://www.w3.org/2000/01/rdf-schema#\"/>\n";
      }

      xml += "  <subject type=\"" + type + "\" uri=\"" + uri + "\">\n";
      
      for(var predicateType in predicates)
      {
        for each(var object:Array in predicates[predicateType])
        {
          xml += "    <predicate type=\"" + namespaces.getNamespace(predicateType) + "\">\n";
          
          if(object["uri"] == "")
          {
            if(object["reify"] == undefined)
            {
              xml += "      <object type=\"rdfs:Literal\">" + object["value"] + "</object>\n";
            }
            else
            {
              // Currently not supported in structXML
            }
          }
          else
          {
            if(object["reify"] == undefined)
            {
              xml += "      <object type=\"" + namespaces.getNamespace(object["type"]) + "\"" +
                                  " uri=\"" + object["uri"] + "\"" +
                            " />\n";
            }
            else
            {
              xml += "      <object type=\"" + namespaces.getNamespace(object["type"]) + "\"" +
                                  " uri=\"" + object["uri"] + "\" >\n"; 
              
              xml += "        <reify type=\"" + namespaces.getNamespace(object["reify"]["type"]) + "\" value=\"" + 
                                                namespaces.getNamespace(object["reify"]["value"]) + "\">\n"; 
                                  
              xml += "      </object>\n"; 
            }
            
          }

          xml += "    </predicate>\n";
        }
      }
          
      xml += "  </subject>\n";
      
      
      if(includeResultset == true)
      {
        xml += "</resultset>\n";
      }   
      
      return(xml);
    }
  }
}