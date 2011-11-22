package 
{
   /**
   * Annotation created by a GATE pipeline process. Each annotation is an annotated word part of
   * a GATE annotations XML file.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class Annotation
  {
    /** ID of the annotation */
    public var id:int;
    
    /** Index of the starting character of the annotated word within the text corpus */
    public var startChar:int;
    
    /** Index of the ending character of the annotated word within the text corpus */
    public var endChar:int;
    
    /** Concept URI related to that annotated word. What that annotation word is about... */
    public var isAbout:String;
    
    /**
     * Cnstructor
     *  
     * @param id ID of the annotation
     * @param startChar Index of the starting character of the annotated word within the text corpus
     * @param endChar Index of the ending character of the annotated word within the text corpus
     * @param isAbout Concept URI related to that annotated word. What that annotation word is about...
     * 
     */
    public function Annotation(id:int, startChar:int, endChar:int, isAbout:String):void
    {
      this.id = id;
      this.startChar = startChar;
      this.endChar = endChar;
      this.isAbout = isAbout;
    }
  }
}