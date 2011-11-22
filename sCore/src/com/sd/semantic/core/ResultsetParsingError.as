package com.sd.semantic.core
{
  /**
   * Error thrown if the raw structXML XML file describing the resultset can't properly be parsed.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  class ResultsetParsingError extends Error
  {
    public function ResultsetParsingError(message:String)
    {
      super(message);
    }
  }
}