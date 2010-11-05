package com.sd.semantic.components.stories
{
  /**
   * A set of annotated words by a GATE process pipeline.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class Annotations
  {
    /** Array of annotations */
    public var annotations:Array /* of annotations */ = [];

    /**
     * Constructor 
     */
    public function Annotations():void
    {
      this.annotations = new Array();
    }

    /**
     * Add an annotation in the annotation set
     *  
     * @param annotation Annotation to add to the annotations set.
     * 
     */
    public function addAnnotation(annotation:Annotation):void
    {
      this.annotations.push(annotation);
    }

    /**
     * Get all related concepts of all annotations belonging to the annotations set.
     *  
     * @return An array of related (is-about) concept URI
     * 
     */
    public function getIsAbouts():Array
    {
      /** array of unique concept URIs to return */
      var uniqueAnnotations:Array = new Array();

      for each(var annotation:Annotation in annotations)
      {
        if(uniqueAnnotations.indexOf(annotation.isAbout) == -1)
        {
          uniqueAnnotations.push(annotation.isAbout);
        }
      }

      return (uniqueAnnotations);
    }

    /**
     * Get all annotations that are related to a target "is-about" concept URI.
     *  
     * @param isAbout Concept URI for which we want related (is-about) annotations.
     * @return 
     * 
     */
    public function getIsAboutAnnotations(isAbout:String):Array
    {
      /** array of unique annotation reference to return */
      var anns:Array = new Array();

      for each(var annotation:Annotation in annotations)
      {
        if(annotation.isAbout == isAbout)
        {
          anns.push(annotation);
        }
      }

      return (anns);
    }
    
    /**
     * Get all annotations that match a preffered label string.
     * 
     * @param prefLabel Preffered label to match for the annotations selection.
     * 
     * @return An array of annotations that match the prefLabel. 
     * 
     */
    public function getPrefLabelAnnotations(prefLabel:String):Array
    {
      /** array of unique annotation reference to return */      
      var anns:Array = new Array();

      for each(var annotation:Annotation in annotations)
      {
        if(annotation.prefLabel == prefLabel)
        {
          anns.push(annotation);
        }
      }

      return (anns);
    }
  }
}