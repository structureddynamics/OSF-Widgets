package com.sd.semantic.core
{
  import mx.collections.ArrayCollection;
  import mx.rpc.xml.SimpleXMLDecoder;

  /**
   * A structXML resultset object. This is the structure exchanged between all semantic components. This data structure
   * is composed of subjects (records) and each subject of a resultset is described using attribute/values. A
   * resultset contains the description of records that are outputed by a system (most likely, a structWSF instance).
   *
   * @see http://openstructs.org/structwsf/xml-data-structure
   * @see http://openstructs.org/structwsf/
   *   
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class Resultset
  {
    /**
     * Prefixes defined in the struxctXML file. These are used to extend the prefixed attribute &amp; types
     * IDs into their full URI version. 
     */
    public var prefixes:Array = new Array();

    /**
     * Subjects described in the resultset
     */
    public var subjects:Array = new Array();

    /** Raw resultset XML structure that get parsed to populate the subjects member */
    private var resultset:XML;

    /** Namespaces mapping structure used to extend and resolve identifiers */
    private var namespaces:Namespaces = new Namespaces();

    /**
     * Create a resultset from an XML structure or an array of subjects.
     *  
     * @param resultsetObj This object can be a a Resultset XML structure, or an array of Subject objects. The array
     *                     of subject objects is usually used to create subset resultsets of an existing resultset.
     * 
     * @return Returns nothing
     */
    public function Resultset(resultsetObj:Object):void
    {
      /**
      * If the resultsetObj is an XML structure, we parse it to populate the resultset object
      */
      if(resultsetObj is XML)
      {
        this.resultset = resultsetObj;

        /** get prefixes */
        for each(var prefix:XML in resultset.prefix)
        {
          if(prefix.@entity && prefix.@uri)
          {
            prefixes[XMLList(prefix.@entity).toString()] = XMLList(prefix.@uri).toString();
          }
          else
          {
            throw new ResultsetParsingError("Expected entity and uri attributes for the prefix");
          }
        }

        /** Get subjects */
        for each(var subject:XML in resultset.subject)
        {
          subjects.push(new Subject(subject, prefixes));
        }
      }

      if(resultsetObj is Array)
      {
        /**
        * We add each subject, one by one, using the addSubject function. This enforce some more
        * validation from the addSubject function 
        */
        for each(var s:Subject in resultsetObj)
        {
          addSubject(s);
        }
      }
    }

    /**
     * Add a subject to the set of subjects belonging to the resultset.
     *  
     * @param subject Subject to be added to the resultset
     * 
     * @return Returns nothing
     * 
     */
    public function addSubject(subject:Subject):void
    {
      /**
      * Check if the subject already exists in the resultset. If it does, we ignore it.
      */
      if(subject)
      {
        for each(var s:Subject in subjects)
        {
          if(subject.uri == s.uri)
          {
            return;
          }
        }

        /**
        * Add the subject to the resultset
        */
        subjects.push(subject);
      }
    }
    
    /**
     * Remove a subject to the set of subjects belonging to the resultset.
     *  
     * @param subject Subject to be removed to the resultset
     * 
     * @return Returns nothing
     * 
     */
    public function removeSubject(subject:Subject):void
    {
      /**
       * Check if the subject already exists in the resultset. If it does, we ignore it.
       */
      if(subject)
      {
        for(var i = 0; i < subjects.length; i++)
        {
          if(subjects[i].uri == subject.uri)
          {
            subjects.splice(i, 1);
          }
        }
      }
    }    

    /**
     * Get all sujects of a certain type from the resultset.
     *  
     * @param type Type of the subjects to get. It can be a full URI or a prefixed ID.
     * @param subResultset Optional subset of a resultset. If this parameter is used, the subjects of the requested type
     *        from this sub-resultset only will be returned.
     * @return An array of subjects that have the input type as type.
     * 
     */
    public function getSubjectsByType(type:String, subResultset:Array = null):Array
    {
      /** results to be returned */
      var results:Array = [];

      /** intermediary structure that reference the resultset where to check for the subjects */
      var targetResultset:Array = [];

      if(subResultset != null)
      {
        targetResultset = subResultset;
      }
      else
      {
        targetResultset = subjects;
      }

      for each(var subject:Subject in targetResultset)
      {
        if(subject.type == type || subject.type == namespaces.getVariable(type)
          || subject.type == namespaces.getNamespace(type))
        {
          results.push(subject);
        }
      }

      return (results);
    }

    /**
     * Get the subject of a given URI from a resultset.
     *  
     * @param uri URI of the subject to get.
     * @param subResultset Optional subset of a resultset. If this parameter is used, the subject of the requested URI
     *        from this sub-resultset only will be returned.
     * @return A subject with that URI. Null is returned if the subject is not found.
     * 
     */
    public function getSubjectByURI(uri:String, subResultset:Array = null):Subject
    {
      /** intermediary structure that reference the resultset where to check for the subjects */
      var targetResultset:Array = [];

      if(subResultset != null)
      {
        targetResultset = subResultset;
      }
      else
      {
        targetResultset = subjects;
      }

      for each(var subject:Subject in targetResultset)
      {
        if(subject.uri == uri)
        {
          return (subject);
        }
      }

      return (null);
    }

    /**
     * Get all types used to describe all subjects of a resultset.
     *  
     * @param subResultset Optional subset of a resultset. If this parameter is used, the types
     *        from this sub-resultset only will be returned.
     * @return An array of types used to describe all subjects of the resultset
     * 
     */
    public function getSubjectTypes(subResultset:Array = null):Array
    {
      /** results to be returned */
      var results:Array = [];

      /** intermediary structure that reference the resultset where to check for the subjects */
      var targetResultset:Array = [];

      if(subResultset != null)
      {
        targetResultset = subResultset;
      }
      else
      {
        targetResultset = subjects;
      }

      for each(var subject:Subject in targetResultset)
      {
        if(results.indexOf(subject.type) == -1)
        {
          results.push(subject.type);
        }
      }

      return (results);
    }

    /**
     * Get all attributes used to describe all subjects of a resultset.
     *  
     * @param subResultset Optional subset of a resultset. If this parameter is used, the attributes
     *        from this sub-resultset only will be returned.
     * @return An array of attributes used to describe all subjects of the resultset
     * 
     */
    public function getSubjectAttributes(subResultset:Array = null):Array
    {
      /** results to be returned */
      var results:Array = [];

      /** intermediary structure that reference the resultset where to check for the subjects */
      var targetResultset:Array = [];

      if(subResultset != null)
      {
        targetResultset = subResultset;
      }
      else
      {
        targetResultset = subjects;
      }

      for each(var subject:Subject in targetResultset)
      {
        for(var predicate:String in subject.predicates)
        {
          if(results.indexOf(predicate) == -1)
          {
            results.push(predicate);
          }
        }
      }

      return (results);
    }

    /**
     * Get a list of subjects which are described for a specific predicate/object-value pair.
     *  
     * @param predicate URI or prefixed ID of the target predicate
     * @param objectValue Value of the object
     * @param subResultset Optional subset of a resultset. If this parameter is used, only the subjects of this 
     *        sub-resultset will be matched.
     * @return An array of subjects that are described using this predicate/object-value pair. An empty array
     *         is returned if no subject match this query.
     */
    public function getSubjectsByPredicateObjectValue(predicate:String, objectValue:String,
      subResultset:Array = null):Array
    {
      /** results to be returned */
      var results:Array = [];

      /** intermediary structure that reference the resultset where to check for the subjects */
      var targetResultset:Array = [];

      if(subResultset.lenght != null)
      {
        targetResultset = subResultset;
      }
      else
      {
        targetResultset = subjects;
      }

      for each(var subject:Subject in targetResultset)
      {
        var breakLoop = false;

        for(var pred:String in subject.predicates)
        {
          for each(var predicateValue:Array in subject.predicates[pred])
          {
            if((predicateValue.uri == objectValue || predicateValue.uri == namespaces.getVariable(objectValue)
               || predicateValue.uri == namespaces.getNamespace(objectValue)) && pred == predicate)
            {
              results.push(subject);
              breakLoop = true;
              break;
            }
          }

          if(breakLoop)
          {
            break;
          }
        }
      }

      return (results);
    }
  }
}